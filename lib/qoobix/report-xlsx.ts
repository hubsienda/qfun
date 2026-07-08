import * as XLSX from 'xlsx';
import type {
  ClientConfiguration,
  GeneratedIntelligence,
  IntelligenceRequest
} from '@/lib/qoobix/types';

type CreateXlsxWorkbookInput = {
  client: ClientConfiguration;
  request: IntelligenceRequest;
  intelligence: GeneratedIntelligence;
};

type SheetRow = Record<string, string>;

function cleanOutput(value: string | null | undefined) {
  return (value && value.trim() ? value : '')
    .replace(/\bUnverified\b/g, 'Candidate for verification')
    .replace(/\bunverified\b/g, 'candidate for verification');
}

function addSheet(workbook: XLSX.WorkBook, name: string, rows: SheetRow[]) {
  const worksheet = XLSX.utils.json_to_sheet(rows.length ? rows : [{ Note: 'No rows generated.' }]);
  const range = XLSX.utils.decode_range(worksheet['!ref'] ?? 'A1:A1');

  worksheet['!autofilter'] = {
    ref: XLSX.utils.encode_range(range)
  };

  worksheet['!cols'] = Array.from({ length: range.e.c + 1 }, (_, index) => {
    if (index === 0) return { wch: 14 };
    if (index <= 5) return { wch: 28 };
    return { wch: 44 };
  });

  XLSX.utils.book_append_sheet(workbook, worksheet, name.slice(0, 31));
}

function listRows(items: string[], label: string): SheetRow[] {
  return items.map((item, index) => ({
    Rank: String(index + 1),
    [label]: cleanOutput(item),
    'Why it matters': 'Review against the commercial objective and prioritise if relevant.',
    'Suggested verification': 'Check source evidence, buyer/channel feedback, and internal feasibility.'
  }));
}

function requestSummaryRows(client: ClientConfiguration, request: IntelligenceRequest): SheetRow[] {
  return [
    { Field: 'Operator workspace', Value: client.name },
    { Field: 'Operator sector', Value: client.sector },
    { Field: 'Operator website', Value: client.website ?? 'Not provided' },
    { Field: 'Product/service analysed', Value: request.productOrService },
    { Field: 'Target countries', Value: request.targetCountries },
    { Field: 'Target geography', Value: request.targetGeography || 'Not provided' },
    { Field: 'Market question', Value: request.marketQuestion },
    { Field: 'Commercial objective', Value: request.commercialObjective },
    { Field: 'Commercial objective details', Value: request.commercialObjectiveDetails || 'Not provided' },
    { Field: 'Discovery target', Value: request.discoveryTarget || 'Not provided' },
    { Field: 'Include categories', Value: request.includeCategories || 'Not provided' },
    { Field: 'Exclude categories', Value: request.excludeCategories || 'Not provided' },
    { Field: 'Target customer types', Value: request.targetCustomerTypes || 'Not provided' },
    { Field: 'Target channels', Value: request.targetChannels || 'Not provided' },
    { Field: 'Known competitors', Value: request.knownCompetitors || 'Not provided' },
    { Field: 'Known partners/distributors', Value: request.knownPartners || 'Not provided' },
    { Field: 'Preferred output language', Value: request.preferredOutputLanguage },
    { Field: 'Generated', Value: new Date().toLocaleDateString('en-GB') },
    {
      Field: 'Report retention',
      Value: `${client.fileRetentionDays} day(s), unless cleaned earlier after expiry`
    },
    {
      Field: 'Verification notice',
      Value:
        'AI-assisted output. Named organisations, websites and market claims require verification before commercial, legal, financial, regulatory, technical, or strategic use.'
    }
  ];
}

function actionRows(actions: string[]): SheetRow[] {
  return actions.map((action, index) => ({
    Priority: String(index + 1),
    Action: cleanOutput(action),
    Owner: '',
    Deadline: '',
    Status: 'Not started',
    'Why this matters': 'Turns the intelligence into a concrete commercial step.',
    'Evidence required':
      'Source checks, buyer/channel feedback, distributor validation, or internal feasibility review.',
    Notes: ''
  }));
}

function candidateRows(intelligence: GeneratedIntelligence): SheetRow[] {
  const partnerRows = intelligence.potentialPartnersProspects.map((item, index) => ({
    Rank: String(index + 1),
    Section: 'Candidate organisation',
    'Candidate name': cleanOutput(item.name),
    'Type/category': cleanOutput(item.category),
    'Town/locality': cleanOutput(item.locality),
    Region: cleanOutput(item.region),
    Country: cleanOutput(item.countryOrRegion),
    Website: cleanOutput(item.website),
    'Verification URL': cleanOutput(item.verificationUrl),
    'Place ID': cleanOutput(item.placeId),
    Rating: cleanOutput(item.rating),
    'Review count': cleanOutput(item.reviewCount),
    'Business status': cleanOutput(item.businessStatus),
    'Relevance status': cleanOutput(item.status || 'Candidate organisation for verification'),
    'Relevance score': '',
    'Relevance reason': cleanOutput(item.relevance),
    'Suggested verification action': cleanOutput(item.suggestedAction),
    Notes: cleanOutput(item.notes),
    'Source query': cleanOutput(item.sourceQuery),
    Source: cleanOutput(item.source)
  }));

  const competitorRows = intelligence.competitorRows.map((item, index) => ({
    Rank: String(partnerRows.length + index + 1),
    Section: 'Competitor / alternative candidate',
    'Candidate name': cleanOutput(item.name),
    'Type/category': cleanOutput(item.type),
    'Town/locality': cleanOutput(item.locality),
    Region: cleanOutput(item.region),
    Country: cleanOutput(item.countryOrRegion),
    Website: cleanOutput(item.website),
    'Verification URL': cleanOutput(item.verificationUrl),
    'Place ID': cleanOutput(item.placeId),
    Rating: cleanOutput(item.rating),
    'Review count': cleanOutput(item.reviewCount),
    'Business status': cleanOutput(item.businessStatus),
    'Relevance status': cleanOutput(item.status || 'Candidate organisation for verification'),
    'Relevance score': '',
    'Relevance reason': cleanOutput(item.relevance),
    'Suggested verification action':
      'Check relevance, positioning, geography, offer, website and whether this is a direct competitor, substitute or local alternative.',
    Notes: cleanOutput(item.notes),
    'Source query': cleanOutput(item.sourceQuery),
    Source: cleanOutput(item.source)
  }));

  return [...partnerRows, ...competitorRows];
}

function verificationRows(intelligence: GeneratedIntelligence): SheetRow[] {
  const sourceRows = intelligence.sourceNotesLimitations.map((note, index) => ({
    Rank: String(index + 1),
    'Verification item': cleanOutput(note),
    Category: 'Source / limitation',
    'Suggested verification action':
      'Check primary sources, official directories, trade bodies, buyer feedback, distributor confirmation, or direct outreach.',
    Status: 'Open',
    Website: '',
    'Verification URL': '',
    Notes: ''
  }));

  const candidateVerificationRows = candidateRows(intelligence).map((row, index) => ({
    Rank: String(sourceRows.length + index + 1),
    'Verification item': row['Candidate name'],
    Category: row['Type/category'],
    'Suggested verification action': row['Suggested verification action'],
    Status: row['Relevance status'],
    Website: row.Website,
    'Verification URL': row['Verification URL'],
    Notes: row.Notes
  }));

  return [...sourceRows, ...candidateVerificationRows];
}

export function createXlsxWorkbook(input: CreateXlsxWorkbookInput): Buffer {
  const { client, request, intelligence } = input;
  const workbook = XLSX.utils.book_new();

  addSheet(workbook, 'Request summary', requestSummaryRows(client, request));

  addSheet(workbook, 'Decision brief', [
    {
      Section: 'Executive summary',
      Content: cleanOutput(intelligence.executiveSummary)
    },
    {
      Section: 'Client/product context',
      Content: cleanOutput(intelligence.clientProductContext)
    },
    {
      Section: 'Target market overview',
      Content: cleanOutput(intelligence.targetMarketOverview)
    }
  ]);

  addSheet(workbook, 'Candidate data', candidateRows(intelligence));
  addSheet(workbook, 'Regional priorities', listRows(intelligence.regionalPriorities, 'Priority'));
  addSheet(workbook, 'Demand signals', listRows(intelligence.demandSignals, 'Signal'));
  addSheet(workbook, 'Channel opportunities', listRows(intelligence.channelOpportunities, 'Opportunity'));
  addSheet(workbook, 'Positioning', listRows(intelligence.positioningRecommendations, 'Recommendation'));
  addSheet(workbook, 'Action matrix', actionRows(intelligence.actionPriorities));
  addSheet(workbook, 'Risks caveats', listRows(intelligence.commercialRisks, 'Risk or caveat'));
  addSheet(workbook, 'Verification workflow', verificationRows(intelligence));
  addSheet(workbook, 'Source limitations', listRows(intelligence.sourceNotesLimitations, 'Source note or limitation'));

  return XLSX.write(workbook, {
    type: 'buffer',
    bookType: 'xlsx'
  }) as Buffer;
}
