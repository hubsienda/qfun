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

type CountryDiscoveryProfile = {
  regionCode: string;
  languageCode: string;
  countryNames: string[];
  countryRejectTerms: string[];
  priorityCities: string[];
  partnerQueries: string[];
  competitorQueries: string[];
  distributorQueries: string[];
  prospectQueries: string[];
  genericQueries: string[];
};

type DiscoveryQuery = {
  text: string;
  city?: string;
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

function cleanText(value: string | null | undefined) {
  return value && value.trim() ? value.trim() : '';
}

function splitCountries(value: string) {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalise(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

function uniqueValues(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

function inferDiscoveryFamily(objective: string) {
  const lower = objective.toLowerCase();

  if (lower.includes('competitor')) {
    return 'competitor';
  }

  if (lower.includes('distributor')) {
    return 'distributor';
  }

  if (lower.includes('partner')) {
    return 'partner';
  }

  if (lower.includes('lead') || lower.includes('prospect')) {
    return 'prospect';
  }

  return 'generic';
}

function inferCandidateType(objective: string) {
  const family = inferDiscoveryFamily(objective);

  if (family === 'competitor') {
    return 'competitor_or_substitute';
  }

  if (family === 'distributor') {
    return 'potential_distributor';
  }

  if (family === 'partner') {
    return 'potential_partner';
  }

  if (family === 'prospect') {
    return 'potential_prospect';
  }

  return 'candidate_organisation';
}

function getCountryProfile(targetCountry: string): CountryDiscoveryProfile {
  const country = normalise(targetCountry);

  if (country.includes('italy') || country.includes('italia')) {
    return {
      regionCode: 'IT',
      languageCode: 'it',
      countryNames: ['Italy', 'Italia'],
      countryRejectTerms: [
        'United States',
        'USA',
        'Canada',
        'Mexico',
        'India',
        'Australia',
        'United Kingdom',
        'España',
        'Spain',
        'France',
        'Germany',
        'Deutschland',
        'Brazil',
        'Brasil'
      ],
      priorityCities: ['Milano', 'Roma', 'Torino', 'Bologna', 'Padova', 'Verona', 'Firenze'],
      partnerQueries: [
        'consulenza export imprese',
        'consulenza internazionalizzazione imprese',
        'consulenza sviluppo commerciale B2B',
        'consulenza business development',
        'consulenza digital transformation PMI',
        'consulenza innovazione imprese',
        'agenzia lead generation B2B',
        'società consulenza strategica PMI',
        'associazione imprese internazionalizzazione',
        'camera di commercio servizi internazionalizzazione'
      ],
      competitorQueries: [
        'società ricerche di mercato B2B',
        'società business intelligence',
        'consulenza market intelligence',
        'consulenza analisi di mercato',
        'agenzia lead generation B2B',
        'società consulenza commerciale',
        'software business intelligence',
        'società consulenza export',
        'consulenza strategica imprese',
        'data intelligence aziende'
      ],
      distributorQueries: [
        'distributori B2B',
        'grossisti settore',
        'rappresentanti commerciali',
        'agenzie rappresentanza commerciale',
        'reti vendita B2B',
        'importatori distributori',
        'fornitori B2B',
        'commercializzazione prodotti aziende'
      ],
      prospectQueries: [
        'aziende B2B',
        'imprese export',
        'PMI innovative',
        'aziende manifatturiere export',
        'aziende servizi B2B',
        'società consulenza imprese'
      ],
      genericQueries: [
        'consulenza imprese',
        'servizi sviluppo commerciale aziende',
        'consulenza strategica aziende',
        'business development consultant',
        'market research company'
      ]
    };
  }

  if (country.includes('spain') || country.includes('espana') || country.includes('españa')) {
    return {
      regionCode: 'ES',
      languageCode: 'es',
      countryNames: ['Spain', 'España'],
      countryRejectTerms: [
        'United States',
        'USA',
        'Canada',
        'Mexico',
        'India',
        'Australia',
        'United Kingdom',
        'Italy',
        'Italia',
        'France',
        'Germany'
      ],
      priorityCities: ['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao', 'Málaga', 'Zaragoza'],
      partnerQueries: [
        'consultoría exportación empresas',
        'consultoría internacionalización empresas',
        'consultoría desarrollo comercial B2B',
        'consultoría transformación digital pymes',
        'agencia generación leads B2B',
        'consultoría innovación empresas',
        'cámara de comercio internacionalización'
      ],
      competitorQueries: [
        'empresa investigación de mercados B2B',
        'consultoría inteligencia de mercado',
        'empresa business intelligence',
        'consultoría análisis de mercado',
        'agencia generación leads B2B',
        'consultoría comercial empresas'
      ],
      distributorQueries: [
        'distribuidores B2B',
        'mayoristas sector',
        'representantes comerciales',
        'agencias representación comercial',
        'importadores distribuidores'
      ],
      prospectQueries: [
        'empresas B2B',
        'empresas exportadoras',
        'pymes innovadoras',
        'empresas industriales exportadoras'
      ],
      genericQueries: [
        'consultoría empresas',
        'servicios desarrollo comercial empresas',
        'consultoría estratégica empresas',
        'business development consultant',
        'market research company'
      ]
    };
  }

  if (
    country.includes('united kingdom') ||
    country.includes('uk') ||
    country.includes('england') ||
    country.includes('britain')
  ) {
    return {
      regionCode: 'GB',
      languageCode: 'en',
      countryNames: ['United Kingdom', 'UK', 'England', 'Great Britain'],
      countryRejectTerms: [
        'United States',
        'USA',
        'Canada',
        'Mexico',
        'India',
        'Australia',
        'Italy',
        'Italia',
        'Spain',
        'España',
        'France',
        'Germany'
      ],
      priorityCities: ['London', 'Manchester', 'Birmingham', 'Leeds', 'Bristol', 'Glasgow', 'Edinburgh'],
      partnerQueries: [
        'export consultancy businesses',
        'internationalisation consultancy',
        'B2B business development consultancy',
        'digital transformation consultancy SMEs',
        'B2B lead generation agency',
        'innovation consultancy businesses',
        'chamber of commerce international trade services'
      ],
      competitorQueries: [
        'B2B market research company',
        'market intelligence consultancy',
        'business intelligence company',
        'market analysis consultancy',
        'B2B lead generation agency',
        'commercial strategy consultancy'
      ],
      distributorQueries: [
        'B2B distributors',
        'sector wholesalers',
        'commercial agents',
        'sales representative agencies',
        'importers distributors'
      ],
      prospectQueries: [
        'B2B companies',
        'export businesses',
        'innovative SMEs',
        'industrial exporters'
      ],
      genericQueries: [
        'business consultancy',
        'commercial development services',
        'strategic consultancy',
        'business development consultant',
        'market research company'
      ]
    };
  }

  return {
    regionCode: '',
    languageCode: 'en',
    countryNames: [targetCountry],
    countryRejectTerms: [],
    priorityCities: [],
    partnerQueries: [
      'export consultancy businesses',
      'internationalisation consultancy',
      'B2B business development consultancy',
      'digital transformation consultancy SMEs',
      'B2B lead generation agency',
      'innovation consultancy businesses'
    ],
    competitorQueries: [
      'B2B market research company',
      'market intelligence consultancy',
      'business intelligence company',
      'market analysis consultancy',
      'B2B lead generation agency',
      'commercial strategy consultancy'
    ],
    distributorQueries: [
      'B2B distributors',
      'sector wholesalers',
      'commercial agents',
      'sales representative agencies',
      'importers distributors'
    ],
    prospectQueries: [
      'B2B companies',
      'export businesses',
      'innovative SMEs',
      'industrial exporters'
    ],
    genericQueries: [
      'business consultancy',
      'commercial development services',
      'strategic consultancy',
      'business development consultant',
      'market research company'
    ]
  };
}

function getTemplateQueries(profile: CountryDiscoveryProfile, objective: string) {
  const family = inferDiscoveryFamily(objective);

  if (family === 'competitor') {
    return profile.competitorQueries;
  }

  if (family === 'distributor') {
    return profile.distributorQueries;
  }

  if (family === 'partner') {
    return profile.partnerQueries;
  }

  if (family === 'prospect') {
    return profile.prospectQueries;
  }

  return profile.genericQueries;
}

function buildDiscoverySearchQueries(input: {
  client: ClientConfiguration;
  request: IntelligenceRequest;
}) {
  const { request } = input;
  const countries = splitCountries(request.targetCountries).slice(0, 1);
  const targetCountry = countries[0] ?? request.targetCountries;
  const profile = getCountryProfile(targetCountry);
  const templates = getTemplateQueries(profile, request.commercialObjective);

  const queries: DiscoveryQuery[] = [];
  const cities = profile.priorityCities.length ? profile.priorityCities : [''];

  for (const template of templates) {
    for (const city of cities) {
      const location = city ? `${city} ${targetCountry}` : targetCountry;

      queries.push({
        text: `${template} ${location}`,
        city: city || undefined,
        category: template
      });

      if (queries.length >= env.GOOGLE_PLACES_MAX_TEXT_SEARCH_CALLS) {
        return {
          queries,
          profile,
          targetCountry
        };
      }
    }
  }

  return {
    queries,
    profile,
    targetCountry
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
  profile: CountryDiscoveryProfile;
}): Promise<GooglePlace[]> {
  const apiKey = requireServerEnv('GOOGLE_PLACES_API_KEY');

  const body: Record<string, unknown> = {
    textQuery: input.query.text,
    maxResultCount: 20,
    languageCode: input.profile.languageCode
  };

  if (input.profile.regionCode) {
    body.regionCode = input.profile.regionCode;
  }

  const response = await fetchWithTimeout(
    'https://places.googleapis.com/v1/places:searchText',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask':
          'places.id,places.displayName,places.formattedAddress,places.types,places.googleMapsUri'
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

function hasRejectGeography(input: {
  address: string;
  profile: CountryDiscoveryProfile;
}) {
  const address = normalise(input.address);

  return input.profile.countryRejectTerms.some((term) => address.includes(normalise(term)));
}

function hasAcceptableGeography(input: {
  address: string;
  query: DiscoveryQuery;
  profile: CountryDiscoveryProfile;
}) {
  const address = normalise(input.address);

  if (!address) {
    return false;
  }

  const hasCountry = input.profile.countryNames.some((term) => address.includes(normalise(term)));
  const hasQueryCity = input.query.city ? address.includes(normalise(input.query.city)) : false;

  return hasCountry || hasQueryCity;
}

function scorePlace(input: {
  place: GooglePlace;
  query: DiscoveryQuery;
  profile: CountryDiscoveryProfile;
}) {
  const name = cleanText(input.place.displayName?.text);
  const address = cleanText(input.place.formattedAddress);
  const website = cleanText(input.place.websiteUri);
  const types = input.place.types ?? [];

  if (!name) {
    return -100;
  }

  if (address && hasRejectGeography({ address, profile: input.profile })) {
    return -50;
  }

  let score = 0;

  if (hasAcceptableGeography({ address, query: input.query, profile: input.profile })) {
    score += 45;
  }

  if (website) {
    score += 20;
  }

  if (input.place.googleMapsUri) {
    score += 8;
  }

  if (typeof input.place.rating === 'number') {
    score += 4;
  }

  if (typeof input.place.userRatingCount === 'number' && input.place.userRatingCount > 0) {
    score += 4;
  }

  const normalisedTypes = types.map(normalise).join(' ');
  const normalisedQuery = normalise(input.query.category);

  if (
    normalisedTypes.includes('consult') ||
    normalisedTypes.includes('point_of_interest') ||
    normalisedTypes.includes('establishment')
  ) {
    score += 5;
  }

  if (
    normalisedQuery.includes('consulenza') ||
    normalisedQuery.includes('consult') ||
    normalisedQuery.includes('ricerche') ||
    normalisedQuery.includes('market') ||
    normalisedQuery.includes('business') ||
    normalisedQuery.includes('lead generation')
  ) {
    score += 6;
  }

  return score;
}

function placeToCandidate(input: {
  place: GooglePlace;
  query: DiscoveryQuery;
  profile: CountryDiscoveryProfile;
  request: IntelligenceRequest;
  score: number;
}): ScoredCandidate | null {
  const { place, query, request, score } = input;
  const name = cleanText(place.displayName?.text);

  if (!name) {
    return null;
  }

  const candidateType = inferCandidateType(request.commercialObjective);
  const businessCategories = place.types ?? [];

  return {
    name,
    website: null,
    formattedAddress: cleanText(place.formattedAddress) || null,
    countryOrRegion: cleanText(request.targetCountries) || null,
    placeId: cleanText(place.id) || null,
    businessCategories,
    candidateType,
    source: 'google_places',
    relevanceReason: `Identified by Google Places using the localised query: "${query.text}". Candidate score: ${score}. Google Maps verification link: ${cleanText(place.googleMapsUri) || 'not supplied'}. Must be reviewed for real commercial fit.`,
    suggestedAction:
      'Verify website, location, service scope, buyer fit, decision-maker route, and suitability before outreach.',
    confidence: score >= 70 ? 'medium' : 'requires_verification',
    verificationStatus: 'unverified',
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

  const { queries, profile, targetCountry } = buildDiscoverySearchQueries({
    client,
    request
  });

  const allCandidates: ScoredCandidate[] = [];
  const rejectedCandidates: string[] = [];
  const notes: string[] = [];

  let textSearchCallsUsed = 0;
  let placesReturned = 0;

  for (const query of queries) {
    try {
      const places = await runTextSearch({
        query,
        profile
      });

      textSearchCallsUsed += 1;
      placesReturned += places.length;

      for (const place of places) {
        const score = scorePlace({
          place,
          query,
          profile
        });

        const name = cleanText(place.displayName?.text) || 'Unnamed place';

        if (score < 45) {
          rejectedCandidates.push(`${name} rejected. Score: ${score}. Address: ${place.formattedAddress ?? 'No address'}`);
          continue;
        }

        const candidate = placeToCandidate({
          place,
          query,
          profile,
          request,
          score
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

  if (!candidates.length) {
    notes.push(
      `Discovery did not produce reliable named candidate organisations for ${targetCountry}. The rejected results were mostly outside the target geography, too generic, or too weakly matched.`
    );
  }

  notes.push(
    `Google Places returned ${placesReturned} raw result(s). ${rejectedCandidates.length} result(s) were rejected before Proteus because they failed the geography/relevance quality gate.`
  );

  notes.push(
    'Candidate organisations are provided for verification only. They are not confirmed leads, guaranteed partners, verified distributors, or guaranteed competitors.'
  );

  if (rejectedCandidates.length) {
    notes.push(`Rejected candidate sample: ${rejectedCandidates.slice(0, 8).join(' | ')}`);
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
