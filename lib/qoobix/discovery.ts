import { env, requireServerEnv } from '@/lib/config';
import type {
  ClientConfiguration,
  DiscoveryCandidate,
  DiscoveryUsage,
  IntelligenceRequest
} from '@/lib/qoobix/types';

type GooglePlace = {
  id?: string;
  displayName?: {
    text?: string;
  };
  formattedAddress?: string;
  primaryType?: string;
  types?: string[];
  websiteUri?: string;
  googleMapsUri?: string;
  rating?: number;
  userRatingCount?: number;
  businessStatus?: string;
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
};

type GoogleTextSearchResponse = {
  places?: GooglePlace[];
};

type DiscoveryQuery = {
  text: string;
  geography: string;
  category: string;
};

type ScoredCandidate = DiscoveryCandidate & {
  score: number;
};

export type DiscoveryResult = {
  candidates: DiscoveryCandidate[];
  usage: DiscoveryUsage;
  searchQueries: string[];
  notes: string[];
};

const DEFAULT_EXCLUSION_TERMS = [
  'consulting',
  'consultancy',
  'consultant',
  'business management consultant',
  'marketing agency',
  'internet marketing service',
  'market research',
  'market researcher',
  'business intelligence',
  'software company',
  'software',
  'ai company',
  'ai consultancy',
  'training provider',
  'training centre',
  'general professional service',
  'lead generation',
  'digital transformation'
];

function cleanText(value: string | null | undefined) {
  return value && value.trim() ? value.trim() : '';
}

function normalise(value: string | null | undefined) {
  return (value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitList(value: string | null | undefined) {
  return (value ?? '')
    .split(/[;\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function uniqueValues(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function inferRegionCode(value: string) {
  const normalised = normalise(value);

  if (normalised.includes('spain') || normalised.includes('espana')) return 'ES';
  if (normalised.includes('italy') || normalised.includes('italia')) return 'IT';
  if (normalised.includes('united kingdom') || normalised.includes('uk')) return 'GB';
  if (normalised.includes('france')) return 'FR';
  if (normalised.includes('germany') || normalised.includes('deutschland')) return 'DE';
  if (normalised.includes('portugal')) return 'PT';

  return '';
}

function inferLanguageCode(value: string, outputLanguage: string) {
  const normalisedLanguage = normalise(outputLanguage);
  const normalisedCountry = normalise(value);

  if (normalisedLanguage.includes('spanish') || normalisedLanguage.includes('espanol')) return 'es';
  if (normalisedLanguage.includes('italian') || normalisedLanguage.includes('italiano')) return 'it';
  if (normalisedCountry.includes('spain') || normalisedCountry.includes('espana')) return 'es';
  if (normalisedCountry.includes('italy') || normalisedCountry.includes('italia')) return 'it';

  return 'en';
}

function inferCandidateType(objective: string) {
  const lower = objective.toLowerCase();

  if (lower.includes('competitor')) return 'competitor_or_substitute';
  if (lower.includes('distributor')) return 'potential_distributor';
  if (lower.includes('partner')) return 'potential_partner';
  if (lower.includes('lead') || lower.includes('prospect')) return 'potential_prospect';

  return 'candidate_organisation';
}

function buildDiscoverySearchQueries(request: IntelligenceRequest) {
  const countries = splitList(request.targetCountries);
  const targetCountry = countries[0] ?? request.targetCountries;
  const targetGeographies = splitList(request.targetGeography).length
    ? splitList(request.targetGeography)
    : countries.length
      ? countries
      : [request.targetCountries];
  const includeCategories = splitList(request.includeCategories).length
    ? splitList(request.includeCategories)
    : [request.discoveryTarget || request.productOrService].filter(Boolean);
  const excludeCategories = uniqueValues([...splitList(request.excludeCategories), ...DEFAULT_EXCLUSION_TERMS]);
  const regionCode = inferRegionCode(`${request.targetCountries} ${request.targetGeography}`);
  const languageCode = inferLanguageCode(request.targetCountries, request.preferredOutputLanguage);

  const queries: DiscoveryQuery[] = [];

  for (const category of includeCategories) {
    for (const geography of targetGeographies) {
      const queryText = `${category} ${geography}`.trim();
      const normalisedQuery = normalise(queryText);
      const blocked = excludeCategories.some((term) => normalisedQuery.includes(normalise(term)));

      if (blocked) {
        continue;
      }

      queries.push({
        text: queryText,
        geography,
        category
      });

      if (queries.length >= env.GOOGLE_PLACES_MAX_TEXT_SEARCH_CALLS) {
        return {
          queries,
          targetCountry,
          regionCode,
          languageCode,
          includeCategories,
          excludeCategories,
          targetGeographies
        };
      }
    }
  }

  return {
    queries,
    targetCountry,
    regionCode,
    languageCode,
    includeCategories,
    excludeCategories,
    targetGeographies
  };
}

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function runTextSearch(input: {
  query: DiscoveryQuery;
  regionCode: string;
  languageCode: string;
}): Promise<GooglePlace[]> {
  const apiKey = requireServerEnv('GOOGLE_PLACES_API_KEY');

  const body: Record<string, unknown> = {
    textQuery: input.query.text,
    maxResultCount: 20,
    languageCode: input.languageCode
  };

  if (input.regionCode) {
    body.regionCode = input.regionCode;
  }

  const response = await fetchWithTimeout(
    'https://places.googleapis.com/v1/places:searchText',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask':
          'places.id,places.displayName,places.formattedAddress,places.primaryType,places.types,places.websiteUri,places.googleMapsUri,places.rating,places.userRatingCount,places.businessStatus,places.nationalPhoneNumber,places.internationalPhoneNumber'
      },
      body: JSON.stringify(body)
    },
    env.GOOGLE_PLACES_TIMEOUT_MS
  );

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Google Places Text Search failed: ${response.status} ${text}`);
  }

  const payload = (await response.json()) as GoogleTextSearchResponse;

  return payload.places ?? [];
}

function candidateText(place: GooglePlace, query: DiscoveryQuery) {
  return normalise(
    [
      place.displayName?.text,
      place.primaryType,
      ...(place.types ?? []),
      place.formattedAddress,
      query.category,
      query.text
    ]
      .filter(Boolean)
      .join(' ')
  );
}

function hasTerm(haystack: string, terms: string[]) {
  return terms.some((term) => {
    const normalisedTerm = normalise(term);

    return normalisedTerm.length >= 3 && haystack.includes(normalisedTerm);
  });
}

function hasAcceptableGeography(input: {
  address: string;
  targetCountry: string;
  targetGeographies: string[];
}) {
  const address = normalise(input.address);

  if (!address) return false;

  const countryMatch = normalise(input.targetCountry)
    ? address.includes(normalise(input.targetCountry))
    : false;
  const geographyMatch = input.targetGeographies.some((geo) => address.includes(normalise(geo)));

  return countryMatch || geographyMatch;
}

function validatePlace(input: {
  place: GooglePlace;
  query: DiscoveryQuery;
  request: IntelligenceRequest;
  targetCountry: string;
  includeCategories: string[];
  excludeCategories: string[];
  targetGeographies: string[];
}) {
  const text = candidateText(input.place, input.query);
  const name = cleanText(input.place.displayName?.text);
  const address = cleanText(input.place.formattedAddress);
  const types = input.place.types ?? [];
  const primaryType = input.place.primaryType ?? '';
  const mapsLink = cleanText(input.place.googleMapsUri);
  const website = cleanText(input.place.websiteUri);

  if (!name) {
    return {
      accepted: false,
      score: 0,
      reason: 'Rejected: candidate name missing.',
      matchedExclusion: 'missing name'
    };
  }

  const defaultExclusionHit = hasTerm(text, DEFAULT_EXCLUSION_TERMS);
  const explicitExclusionHit = hasTerm(text, input.excludeCategories);

  if (defaultExclusionHit || explicitExclusionHit) {
    const matched = [...input.excludeCategories, ...DEFAULT_EXCLUSION_TERMS].find((term) =>
      text.includes(normalise(term))
    );

    return {
      accepted: false,
      score: 0,
      reason: `Rejected: matches excluded category${matched ? ` (${matched})` : ''}.`,
      matchedExclusion: matched ?? 'excluded category'
    };
  }

  let score = 0;
  const includeMatch = hasTerm(text, input.includeCategories);
  const targetMatch = hasTerm(text, [input.request.discoveryTarget, input.request.productOrService]);
  const geoMatch = hasAcceptableGeography({
    address,
    targetCountry: input.targetCountry,
    targetGeographies: input.targetGeographies
  });
  const foodPlaceBoost = ['restaurant', 'food', 'meal_takeaway', 'cafe', 'bar'].some((type) =>
    normalise(`${primaryType} ${types.join(' ')}`).includes(type)
  );

  if (includeMatch) score += 45;
  if (targetMatch) score += 20;
  if (geoMatch) score += 20;
  if (foodPlaceBoost) score += 10;
  if (website) score += 3;
  if (mapsLink) score += 2;

  if (!includeMatch && !targetMatch) {
    return {
      accepted: false,
      score,
      reason: 'Rejected: candidate does not match Discovery target or include categories.',
      matchedExclusion: 'no include-category match'
    };
  }

  if (!geoMatch) {
    return {
      accepted: false,
      score,
      reason: 'Rejected: candidate does not match target geography.',
      matchedExclusion: 'geography mismatch'
    };
  }

  if (score < 55) {
    return {
      accepted: false,
      score,
      reason: `Rejected: relevance score ${score} below threshold.`,
      matchedExclusion: 'low relevance score'
    };
  }

  return {
    accepted: true,
    score,
    reason: `Accepted: matches Discovery target/include categories and target geography. Source query: ${input.query.text}.`,
    matchedExclusion: null
  };
}

function placeToCandidate(input: {
  place: GooglePlace;
  query: DiscoveryQuery;
  request: IntelligenceRequest;
  score: number;
  relevanceReason: string;
}): ScoredCandidate | null {
  const { place, query, request, score, relevanceReason } = input;
  const name = cleanText(place.displayName?.text);
  const website = cleanText(place.websiteUri);
  const mapsLink = cleanText(place.googleMapsUri);
  const businessCategories = place.types ?? [];
  const categoryLabel = cleanText(place.primaryType) || businessCategories[0] || query.category;

  if (!name) {
    return null;
  }

  return {
    candidateId: place.id || crypto.randomUUID(),
    name,
    website: website || null,
    websiteAbsenceReason: website ? null : 'not returned by source',
    verificationUrl: mapsLink || null,
    formattedAddress: cleanText(place.formattedAddress) || null,
    locality: query.geography || null,
    region: cleanText(request.targetGeography) || null,
    countryOrRegion: cleanText(request.targetCountries) || null,
    placeId: cleanText(place.id) || null,
    primaryType: cleanText(place.primaryType) || null,
    businessCategories,
    categoryLabel,
    candidateType: inferCandidateType(request.commercialObjective),
    source: 'google_places',
    sourceQuery: query.text,
    rating: typeof place.rating === 'number' ? place.rating : null,
    reviewCount: typeof place.userRatingCount === 'number' ? place.userRatingCount : null,
    businessStatus: cleanText(place.businessStatus) || null,
    phone: cleanText(place.nationalPhoneNumber || place.internationalPhoneNumber) || null,
    relevanceStatus: 'accepted',
    relevanceScore: score,
    relevanceReason,
    suggestedAction:
      'Verify website, location, offer, category fit, active status, customer segment and commercial relevance before outreach or decision-making.',
    requiresManualReview: false,
    rejectionReason: null,
    exportStatus: 'included',
    confidence: score >= 80 ? 'medium' : 'requires_verification',
    verificationStatus: 'candidate',
    score
  };
}

function deduplicateCandidates(candidates: ScoredCandidate[]) {
  const seen = new Set<string>();
  const retained: ScoredCandidate[] = [];

  for (const candidate of candidates.sort((a, b) => b.score - a.score)) {
    const key =
      candidate.placeId ||
      `${candidate.name.toLowerCase()}-${candidate.formattedAddress?.toLowerCase() ?? ''}`;

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    retained.push(candidate);
  }

  return retained;
}

function removeScore(candidate: ScoredCandidate): DiscoveryCandidate {
  const { score: _score, ...cleanCandidate } = candidate;

  return cleanCandidate;
}

export async function runDiscovery(input: {
  client: ClientConfiguration;
  request: IntelligenceRequest;
}): Promise<DiscoveryResult> {
  const { request } = input;

  if (request.intelligenceMode !== 'discovery') {
    return {
      candidates: [],
      usage: {
        textSearchCallsUsed: 0,
        placeDetailsCallsUsed: 0,
        candidateOrganisationsFound: 0,
        candidateOrganisationsRetained: 0
      },
      searchQueries: [],
      notes: ['Discovery was not required for this Analysis Mode job.']
    };
  }

  const {
    queries,
    targetCountry,
    regionCode,
    languageCode,
    includeCategories,
    excludeCategories,
    targetGeographies
  } = buildDiscoverySearchQueries(request);

  if (!queries.length) {
    throw new Error(
      'Discovery cannot run because the query builder produced no safe queries. Check Discovery target, include categories, exclude categories and target geography.'
    );
  }

  const allCandidates: ScoredCandidate[] = [];
  const rejectedCandidates: string[] = [];
  const notes: string[] = [
    'Discovery query builder used the analysed business/job scope only. Operator sector, website and services were not used.',
    `Discovery target: ${request.discoveryTarget}`,
    `Include categories: ${includeCategories.join('; ')}`,
    `Exclude categories: ${excludeCategories.join('; ')}`,
    `Target geography: ${targetGeographies.join('; ')}`
  ];

  let textSearchCallsUsed = 0;
  let placesReturned = 0;
  let emptyWebsiteCount = 0;

  for (const query of queries) {
    try {
      const places = await runTextSearch({
        query,
        regionCode,
        languageCode
      });

      textSearchCallsUsed += 1;
      placesReturned += places.length;

      for (const place of places) {
        const validation = validatePlace({
          place,
          query,
          request,
          targetCountry,
          includeCategories,
          excludeCategories,
          targetGeographies
        });

        const name = cleanText(place.displayName?.text) || 'Unnamed place';

        if (!validation.accepted) {
          rejectedCandidates.push(
            `${name} rejected. ${validation.reason} Source category: ${place.primaryType ?? (place.types ?? []).join(', ') || 'Not supplied'}. Query: ${query.text}.`
          );
          continue;
        }

        if (!cleanText(place.websiteUri)) {
          emptyWebsiteCount += 1;
        }

        const candidate = placeToCandidate({
          place,
          query,
          request,
          score: validation.score,
          relevanceReason: validation.reason
        });

        if (candidate) {
          allCandidates.push(candidate);
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown Google Places error.';
      notes.push(`Discovery query failed: ${query.text}. ${message}`);
    }
  }

  const candidates = deduplicateCandidates(allCandidates)
    .slice(0, 120)
    .map(removeScore);

  const rejectedRatio = placesReturned ? rejectedCandidates.length / placesReturned : 0;

  if (candidates.length < 5) {
    throw new Error(
      'Discovery did not return enough relevant candidates matching the defined scope. The job requires revised search terms, a wider geographic radius, manual verification, or adjusted category filters.'
    );
  }

  if (rejectedRatio > 0.3) {
    notes.push(
      'Discovery Scope Warning: more than 30% of discovered candidates were rejected because they did not match the Discovery target. Review Discovery target, include categories, exclude categories and target geography before client delivery.'
    );
  }

  if (candidates.length && emptyWebsiteCount === candidates.length) {
    notes.push(
      'Website mapping warning: no candidate websites were captured. Check whether website fields were requested, mapped and exported correctly.'
    );
  }

  notes.push(
    `Google Places returned ${placesReturned} raw result(s). ${rejectedCandidates.length} result(s) were rejected before Proteus because they failed category, geography, exclusion or relevance gates.`
  );

  notes.push(
    'Candidate organisations are provided for verification. They are not confirmed leads, guaranteed partners, verified distributors, or guaranteed competitors.'
  );

  if (rejectedCandidates.length) {
    notes.push(`Rejected candidate sample: ${rejectedCandidates.slice(0, 12).join(' | ')}`);
  }

  return {
    candidates,
    usage: {
      textSearchCallsUsed,
      placeDetailsCallsUsed: 0,
      candidateOrganisationsFound: placesReturned,
      candidateOrganisationsRetained: candidates.length
    },
    searchQueries: uniqueValues(queries.map((query) => query.text)),
    notes
  };
}
