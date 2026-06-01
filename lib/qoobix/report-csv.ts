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
  section: string;
  rank: string;
  name: string;
  type: string;
  region: string;
  detail: string;
  suggestedAction: string;
  notes: string;
};

function clean(value: string | null | undefined) {
  return value && value.trim() ? value : '';
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
    'Section',
    'Rank',
    'Name',
    'Type',
    'Region',
    'Detail',
    'Suggested action',
    'Notes'
  ];

  const lines = [
    headers.map(csvEscape).join(','),
    ...rows.map((row) =>
      [
        row.section,
        row.rank,
        row.name,
        row.type,
        row.region,
        row.detail,
        row.suggestedAction,
        row.notes
      ]
        .map((value) => csvEscape(clean(value)))
        .join(',')
    )
  ];

  return `\uFEFF${lines.join('\n')}`;
}

function textRows(section: string, items: string[]): CsvRow[] {
  return items.map((item, index) => ({
    section,
    rank: String(index + 1),
    name: '',
    type: '',
    region: '',
    detail: item,
    suggestedAction: 'Verify before use.',
    notes: ''
  }));
}

export function createCsvExport(input: CreateCsvExportInput): Buffer {
  const { client, request, intelligence } = input;

  const rows: CsvRow[] = [
    {
      section: 'Request summary',
      rank: '',
      name: client.name,
      type: client.sector,
      region: request.targetCountries,
      detail: request.marketQuestion,
      suggestedAction: request.commercialObjective,
      notes: `Product/service: ${request.productOrService}`
    },
    {
      section: 'Decision brief',
      rank: '',
      name: '',
      type: '',
      region: '',
      detail: intelligence.executiveSummary,
      suggestedAction: 'Review and validate before commercial use.',
      notes: ''
    },
    {
      section: 'Client/product context',
      rank: '',
      name: '',
      type: '',
      region: '',
      detail: intelligence.clientProductContext,
      suggestedAction: 'Check against the client business profile.',
      notes: ''
    },
    {
      section: 'Target market overview',
      rank: '',
      name: '',
      type: '',
      region: '',
      detail: intelligence.targetMarketOverview,
      suggestedAction: 'Validate with market evidence.',
      notes: ''
    },
    ...textRows('Demand signal', intelligence.demandSignals),
    ...textRows('Channel opportunity', intelligence.channelOpportunities),
    ...intelligence.potentialPartnersProspects.map((item, index) => ({
      section: 'Potential partner/prospect',
      rank: String(index + 1),
      name: item.name,
      type: item.category,
      region: item.countryOrRegion,
      detail: item.relevance,
      suggestedAction: item.suggestedAction,
      notes: item.notes
    })),
    ...intelligence.competitorRows.map((item, index) => ({
      section: 'Competitor/alternative',
      rank: String(index + 1),
      name: item.name,
      type: item.type,
      region: item.countryOrRegion,
      detail: item.relevance,
      suggestedAction: 'Verify positioning, offer, geography, and relevance.',
      notes: item.notes
    })),
    ...textRows('Competitor/substitute note', intelligence.competitorsAlternatives),
    ...textRows('Regional priority', intelligence.regionalPriorities),
    ...textRows('Positioning recommendation', intelligence.positioningRecommendations),
    ...textRows('Commercial risk/caveat', intelligence.commercialRisks),
    ...intelligence.actionPriorities.map((item, index) => ({
      section: 'Action priority',
      rank: String(index + 1),
      name: '',
      type: '',
      region: '',
      detail: item,
      suggestedAction: 'Assign owner, deadline, and verification step.',
      notes: ''
    })),
    ...intelligence.sourceNotesLimitations.map((item, index) => ({
      section: 'Verification/source limitation',
      rank: String(index + 1),
      name: '',
      type: '',
      region: '',
      detail: item,
      suggestedAction:
        'Check primary sources, official directories, trade bodies, buyer feedback, distributor confirmation, or direct outreach.',
      notes: ''
    }))
  ];

  return Buffer.from(toCsv(rows), 'utf8');
}
