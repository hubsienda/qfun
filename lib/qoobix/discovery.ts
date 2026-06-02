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
  types?: string[];
  websiteUri?: string;
  googleMapsUri?: string;
  rating?: number;
  userRatingCount?: number;
  nationalPhoneNumber?: string;
};

type GoogleTextSearchResponse = {
  places?: GooglePlace[];
};

export type DiscoveryResult = {
  candidates: DiscoveryCandidate[];
  usage: DiscoveryUsage;
  searchQueries: string[];
  notes: string[];
};

function cleanText(value: string | null | undefined) {
  return value && value.trim() ? value.trim() : '';
}

function splitCountries(value: string) {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function uniqueValues(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function inferCandidateType(objective: string) {
  const lower = objective.toLowerCase();

  if (lower.includes('competitor')) {
    return 'competitor_or_substitute';
  }

  if (lower.includes('distributor')) {
    return 'potential_distributor';
  }

  if (lower.includes('partner')) {
    return 'potential_partner';
  }

  if (lower.includes('lead') || lower.includes('prospect')) {
    return 'potential_prospect';
  }

  return 'candidate_organisation';
}

function buildDiscoverySearchQueries(input: {
  client: ClientConfiguration;
  request: IntelligenceRequest;
}) {
  const { client, request } = input;
  const countries = splitCountries(request.targetCountries).slice(0, 2);
  const candidateType = inferCandidateType(request.commercialObjective);

  const product = cleanText(request.productOrService) || cleanText(client.productsServices) || 'business service';
  const customerTypes =
    cleanText(request.targetCustomerTypes) ||
    client.targetCustomerTypes.join(', ') ||
    'business customers';
  const channels =
    cleanText(request.targetChannels) || client.targetChannels.join(', ') || 'distributors partners';
  const competitors = cleanText(request.knownCompetitors) || cleanText(client.knownCompetitors);

  const queries: string[] = [];

  for (const country of countries.length ? countries : ['target country']) {
    if (candidateType === 'competitor_or_substitute') {
      queries.push(`${product} competitors alternatives suppliers ${country}`);
      queries.push(`${product} distributors suppliers wholesalers ${country}`);
      if (competitors) {
        queries.push(`${competitors} alternative suppliers ${country}`);
      }
    } else if (candidateType === 'potential_distributor') {
      queries.push(`${product} distributors wholesalers ${country}`);
      queries.push(`${channels} ${product} ${country}`);
      queries.push(`${customerTypes} suppliers distributors ${country}`);
    } else if (candidateType === 'potential_partner') {
      queries.push(`${product} partners representatives consultants ${country}`);
      queries.push(`${channels} ${product} partners ${country}`);
      queries.push(`${customerTypes} service providers associations ${country}`);
    } else {
      queries.push(`${product} ${channels} ${country}`);
      queries.push(`${customerTypes} ${product} ${country}`);
      queries.push(`${product} suppliers service providers ${country}`);
    }
  }

  return uniqueValues(queries).slice(0, env.GOOGLE_PLACES_MAX_TEXT_SEARCH_CALLS);
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

async function runTextSearch(query: string): Promise<GooglePlace[]> {
  const apiKey = requireServerEnv('GOOGLE_PLACES_API_KEY');

  const response = await fetchWithTimeout(
    'https://places.googleapis.com/v1/places:searchText',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask':
          'places.id,places.displayName,places.formattedAddress,places.types,places.websiteUri,places.googleMapsUri,places.rating,places.userRatingCount,places.nationalPhoneNumber'
      },
      body: JSON.stringify({
        textQuery: query,
        maxResultCount: 20
      })
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

function placeToCandidate(input: {
  place: GooglePlace;
  query: string;
  request: IntelligenceRequest;
}): DiscoveryCandidate | null {
  const { place, query, request } = input;
  const name = cleanText(place.displayName?.text);

  if (!name) {
    return null;
  }

  const candidateType = inferCandidateType(request.commercialObjective);
  const businessCategories = place.types ?? [];

  return {
    name,
    website: cleanText(place.websiteUri) || null,
    formattedAddress: cleanText(place.formattedAddress) || null,
    countryOrRegion: cleanText(request.targetCountries) || null,
    placeId: cleanText(place.id) || null,
    businessCategories,
    candidateType,
    source: 'google_places',
    relevanceReason: `Identified by Google Places search query: "${query}". Must be reviewed for real commercial fit.`,
    suggestedAction:
      'Verify website, business activity, geography, relevance, decision-maker route, and suitability before outreach.',
    confidence: 'requires_verification',
    verificationStatus: 'unverified'
  };
}

function deduplicateCandidates(candidates: DiscoveryCandidate[]) {
  const seen = new Set<string>();
  const retained: DiscoveryCandidate[] = [];

  for (const candidate of candidates) {
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

export async function runDiscovery(input: {
  client: ClientConfiguration;
  request: IntelligenceRequest;
}): Promise<DiscoveryResult> {
  const { client, request } = input;

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

  const searchQueries = buildDiscoverySearchQueries({ client, request });
  const allCandidates: DiscoveryCandidate[] = [];
  const notes: string[] = [];

  let textSearchCallsUsed = 0;

  for (const query of searchQueries) {
    try {
      const places = await runTextSearch(query);
      textSearchCallsUsed += 1;

      for (const place of places) {
        const candidate = placeToCandidate({
          place,
          query,
          request
        });

        if (candidate) {
          allCandidates.push(candidate);
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown Google Places error.';
      notes.push(`Discovery query failed: ${query}. ${message}`);
    }
  }

  const candidates = deduplicateCandidates(allCandidates).slice(0, 120);

  return {
    candidates,
    usage: {
      textSearchCallsUsed,
      placeDetailsCallsUsed: 0,
      candidateOrganisationsFound: allCandidates.length,
      candidateOrganisationsRetained: candidates.length
    },
    searchQueries,
    notes: [
      ...notes,
      'Candidate organisations are provided for verification only. They are not confirmed leads, guaranteed partners, verified distributors, or guaranteed competitors.'
    ]
  };
}
