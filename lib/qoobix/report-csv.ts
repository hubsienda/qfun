import type {
  ClientConfiguration,
  GeneratedIntelligence,
  IntelligenceRequest
} from '@/lib/qoobix/types';

type CreateCsvExportInput = {
  client: ClientConfiguration;
  request: IntelligenceRequest;
  intelligence: GeneratedIntelligence;
};

type CsvRow = {
  rank: string;
  section: string;
  candidateName: string;
  typeCategory: string;
  townLocality: string;
  region: string;
  country: string;
  website: string;
  verificationUrl: string;
  placeId: string;
  rating: string;
  reviewCount: string;
  businessStatus: string;
  relevanceStatus: string;
  relevanceScore: string;
  relevanceReason: string;
  suggestedVerificationAction: string;
  notes: string;
  sourceQuery: string;
  source: string;
};

function clean(value: string | null | undefined) {
  return (value && value.trim() ? value : '')
    .replace(/\bUnverified\b/g, 'Candidate for verification')
    .replace(/\bunverified\b/g, 'candidate for verification');
}

function csvEscape(value: string) {
  const cleaned = value.replaceAll('\r\n', '\n').replaceAll('\r', '\n');

  if (/[",\n]/.test(cleaned)) {
    return `"${cleaned.replaceAll('"', '""')}"`;
  }

  return cleaned;
}

function toCsv(rows: CsvRow[]) {
  const headers = [
    'Rank',
    'Section',
    'Candidate name',
    'Type/category',
    'Town/locality',
    'Region',
    'Country',
    'Website',
    'Verification URL',
    'Place ID',
    'Rating',
    'Review count',
    'Business status',
    'Relevance status',
    'Relevance score',
    'Relevance reason',
    'Suggested verification action',
    'Notes',
    'Source query',
    'Source'
  ];

  const lines = [
    headers.map(csvEscape).join(','),
    ...rows.map((row) =>
      [
        row.rank,
        row.section,
        row.candidateName,
        row.typeCategory,
        row.townLocality,
        row.region,
        row.country,
        row.website,
        row.verificationUrl,
        row.placeId,
        row.rating,
        row.reviewCount,
        row.businessStatus,
        row.relevanceStatus,
        row.relevanceScore,
        row.relevanceReason,
        row.suggestedVerificationAction,
        row.notes,
        row.sourceQuery,
        row.source
      ]
        .map((value) => csvEscape(clean(value)))
        .join(',')
    )
  ];

  return `\uFEFF${lines.join('\n')}`;
}

export function createCsvExport(input: CreateCsvExportInput): Buffer {
  const { intelligence } = input;

  const partnerRows: CsvRow[] = intelligence.potentialPartnersProspects.map((item, index) => ({
    rank: String(index + 1),
    section: 'Candidate organisation',
    candidateName: item.name,
    typeCategory: item.category,
    townLocality: item.locality,
    region: item.region,
    country: item.countryOrRegion,
    website: item.website,
    verificationUrl: item.verificationUrl,
    placeId: item.placeId,
    rating: item.rating,
    reviewCount: item.reviewCount,
    businessStatus: item.businessStatus,
    relevanceStatus: item.status || 'Candidate organisation for verification',
    relevanceScore: '',
    relevanceReason: item.relevance,
    suggestedVerificationAction: item.suggestedAction,
    notes: item.notes,
    sourceQuery: item.sourceQuery,
    source: item.source
  }));

  const competitorRows: CsvRow[] = intelligence.competitorRows.map((item, index) => ({
    rank: String(partnerRows.length + index + 1),
    section: 'Competitor / alternative candidate',
    candidateName: item.name,
    typeCategory: item.type,
    townLocality: item.locality,
    region: item.region,
    country: item.countryOrRegion,
    website: item.website,
    verificationUrl: item.verificationUrl,
    placeId: item.placeId,
    rating: item.rating,
    reviewCount: item.reviewCount,
    businessStatus: item.businessStatus,
    relevanceStatus: item.status || 'Candidate organisation for verification',
    relevanceScore: '',
    relevanceReason: item.relevance,
    suggestedVerificationAction:
      'Check relevance, positioning, geography, offer, website and whether this is a direct competitor, substitute or local alternative.',
    notes: item.notes,
    sourceQuery: item.sourceQuery,
    source: item.source
  }));

  const rows = [...partnerRows, ...competitorRows];

  return Buffer.from(toCsv(rows), 'utf8');
}
