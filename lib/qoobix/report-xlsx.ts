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
    if (index === 1) return { wch: 34 };
    if (index === 2) return { wch: 34 };
    return { wch: 46 };
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
    { Field: 'Client', Value: client.name },
    { Field: 'Sector', Value: client.sector },
    { Field: 'Website', Value: client.website ?? 'Not provided' },
    { Field: 'Product/service analysed', Value: request.productOrService },
    { Field: 'Target countries', Value: request.targetCountries },
    { Field: 'Market question', Value: request.marketQuestion },
    { Field: 'Commercial objective', Value: request.commercialObjective },
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
        'AI-assisted output. Check all information before commercial, legal, financial, regulatory, technical, or strategic use.'
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

function verificationRows(intelligence: GeneratedIntelligence): SheetRow[] {
  const sourceRows = intelligence.sourceNotesLimitations.map((note, index) => ({
    Rank: String(index + 1),
    'Verification item': cleanOutput(note),
    Category: 'Source / limitation',
    'Suggested verification action':
      'Check primary sources, official directories, trade bodies, buyer feedback, distributor confirmation, or direct outreach.',
    Status: 'Open',
    'Verification URL': '',
    Notes: ''
  }));

  const partnerRows = intelligence.potentialPartnersProspects.slice(0, 20).map((item, index) => ({
    Rank: String(sourceRows.length + index + 1),
    'Verification item': cleanOutput(item.name),
    Category: cleanOutput(item.category),
    'Suggested verification action': cleanOutput(item.suggestedAction),
    Status: cleanOutput(item.status || 'Candidate for verification'),
    'Verification URL': item.verificationUrl || '',
    Notes: cleanOutput(item.notes)
  }));

  const competitorRows = intelligence.competitorRows.slice(0, 20).map((item, index) => ({
    Rank: String(sourceRows.length + partnerRows.length + index + 1),
    'Verification item': cleanOutput(item.name),
    Category: cleanOutput(item.type),
    'Suggested verification action':
      'Check relevance, positioning, geography, offer, and whether this is a direct competitor, substitute, or status-quo alternative.',
    Status: cleanOutput(item.status || 'Candidate for verification'),
    'Verification URL': item.verificationUrl || '',
    Notes: cleanOutput(item.notes)
  }));

  return [...sourceRows, ...partnerRows, ...competitorRows];
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

  addSheet(workbook, 'Regional priorities', listRows(intelligence.regionalPriorities, 'Priority'));

  addSheet(
    workbook,
    'Potential partners',
    intelligence.potentialPartnersProspects.map((item, index) => ({
      Rank: String(index + 1),
      'Name or category': cleanOutput(item.name),
      Type: cleanOutput(item.category),
      'Country or region': cleanOutput(item.countryOrRegion),
      Status: cleanOutput(item.status || 'Candidate for verification'),
      'Verification URL': item.verificationUrl || '',
      Relevance: cleanOutput(item.relevance),
      'Suggested action': cleanOutput(item.suggestedAction),
      Notes: cleanOutput(item.notes)
    }))
  );

  addSheet(
    workbook,
    'Competitors alternatives',
    intelligence.competitorRows.map((item, index) => ({
      Rank: String(index + 1),
      'Name or category': cleanOutput(item.name),
      Type: cleanOutput(item.type),
      'Country or region': cleanOutput(item.countryOrRegion),
      Status: cleanOutput(item.status || 'Candidate for verification'),
      'Verification URL': item.verificationUrl || '',
      Relevance: cleanOutput(item.relevance),
      Notes: cleanOutput(item.notes)
    }))
  );

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
