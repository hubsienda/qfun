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

function addSheet(workbook: XLSX.WorkBook, name: string, rows: SheetRow[]) {
  const worksheet = XLSX.utils.json_to_sheet(rows.length ? rows : [{ Note: 'No rows generated.' }]);
  const range = XLSX.utils.decode_range(worksheet['!ref'] ?? 'A1:A1');

  worksheet['!autofilter'] = {
    ref: XLSX.utils.encode_range(range)
  };

  worksheet['!cols'] = Array.from({ length: range.e.c + 1 }, (_, index) => {
    if (index === 0) {
      return { wch: 12 };
    }

    if (index === 1) {
      return { wch: 30 };
    }

    return { wch: 55 };
  });

  worksheet['!rows'] = Array.from({ length: range.e.r + 1 }, (_, index) => ({
    hpt: index === 0 ? 24 : 54
  }));

  XLSX.utils.book_append_sheet(workbook, worksheet, name.slice(0, 31));
}

function textRows(items: string[], section: string): SheetRow[] {
  return items.map((item, index) => ({
    Rank: String(index + 1),
    Section: section,
    Detail: item,
    'Suggested verification': 'Check source evidence, buyer/channel feedback, and internal feasibility.'
  }));
}

function requestSummaryRows(client: ClientConfiguration, request: IntelligenceRequest): SheetRow[] {
  return [
    {
      Field: 'Client',
      Value: client.name
    },
    {
      Field: 'Sector',
      Value: client.sector
    },
    {
      Field: 'Website',
      Value: client.website ?? 'Not provided'
    },
    {
      Field: 'Product/service analysed',
      Value: request.productOrService
    },
    {
      Field: 'Target countries',
      Value: request.targetCountries
    },
    {
      Field: 'Market question',
      Value: request.marketQuestion
    },
    {
      Field: 'Commercial objective',
      Value: request.commercialObjective
    },
    {
      Field: 'Target customer types',
      Value: request.targetCustomerTypes || 'Not provided'
    },
    {
      Field: 'Target channels',
      Value: request.targetChannels || 'Not provided'
    },
    {
      Field: 'Known competitors',
      Value: request.knownCompetitors || 'Not provided'
    },
    {
      Field: 'Known partners/distributors',
      Value: request.knownPartners || 'Not provided'
    },
    {
      Field: 'Preferred output language',
      Value: request.preferredOutputLanguage
    },
    {
      Field: 'Generated',
      Value: new Date().toLocaleDateString('en-GB')
    },
    {
      Field: 'Report retention',
      Value: `${client.fileRetentionDays} day(s), unless cleaned earlier after expiry`
    },
    {
      Field: 'Verification notice',
      Value:
        'AI-assisted output. Verify all information before commercial, legal, financial, regulatory, technical, or strategic use.'
    }
  ];
}

function decisionBriefRows(intelligence: GeneratedIntelligence): SheetRow[] {
  return [
    {
      Section: 'Executive summary',
      Detail: intelligence.executiveSummary
    },
    {
      Section: 'Client/product context',
      Detail: intelligence.clientProductContext
    },
    {
      Section: 'Target market overview',
      Detail: intelligence.targetMarketOverview
    }
  ];
}

function partnerRows(intelligence: GeneratedIntelligence): SheetRow[] {
  return intelligence.potentialPartnersProspects.map((item, index) => ({
    Rank: String(index + 1),
    Name: item.name,
    Type: item.category,
    Region: item.countryOrRegion,
    Detail: `Relevance: ${item.relevance}`,
    'Suggested action': item.suggestedAction,
    Notes: item.notes
  }));
}

function competitorRows(intelligence: GeneratedIntelligence): SheetRow[] {
  return intelligence.competitorRows.map((item, index) => ({
    Rank: String(index + 1),
    Name: item.name,
    Type: item.type,
    Region: item.countryOrRegion,
    Detail: `Relevance: ${item.relevance}`,
    Notes: item.notes
  }));
}

function actionRows(actions: string[]): SheetRow[] {
  return actions.map((action, index) => ({
    Priority: String(index + 1),
    Action: action,
    Owner: '',
    Deadline: '',
    Status: 'Not started',
    'Evidence required':
      'Source checks, buyer/channel feedback, distributor validation, or internal feasibility review.',
    Notes: ''
  }));
}

function verificationRows(intelligence: GeneratedIntelligence): SheetRow[] {
  const sourceRows = intelligence.sourceNotesLimitations.map((note, index) => ({
    Rank: String(index + 1),
    Item: note,
    Category: 'Source / limitation',
    'Suggested verification':
      'Check primary sources, official directories, trade bodies, buyer feedback, distributor confirmation, or direct outreach.',
    Status: 'Open',
    Notes: ''
  }));

  const partnerVerificationRows = intelligence.potentialPartnersProspects
    .slice(0, 20)
    .map((item, index) => ({
      Rank: String(sourceRows.length + index + 1),
      Item: item.name,
      Category: item.category,
      'Suggested verification': item.suggestedAction,
      Status: 'Open',
      Notes: item.notes
    }));

  const competitorVerificationRows = intelligence.competitorRows.slice(0, 20).map((item, index) => ({
    Rank: String(sourceRows.length + partnerVerificationRows.length + index + 1),
    Item: item.name,
    Category: item.type,
    'Suggested verification':
      'Verify relevance, positioning, geography, offer, and whether this is a direct competitor, substitute, or status-quo alternative.',
    Status: 'Open',
    Notes: item.notes
  }));

  return [...sourceRows, ...partnerVerificationRows, ...competitorVerificationRows];
}

export function createXlsxWorkbook(input: CreateXlsxWorkbookInput): Buffer {
  const { client, request, intelligence } = input;
  const workbook = XLSX.utils.book_new();

  addSheet(workbook, 'Request summary', requestSummaryRows(client, request));
  addSheet(workbook, 'Decision brief', decisionBriefRows(intelligence));
  addSheet(workbook, 'Regional priorities', textRows(intelligence.regionalPriorities, 'Regional priority'));
  addSheet(workbook, 'Potential partners', partnerRows(intelligence));
  addSheet(workbook, 'Competitors', competitorRows(intelligence));
  addSheet(workbook, 'Demand signals', textRows(intelligence.demandSignals, 'Demand signal'));
  addSheet(workbook, 'Channels', textRows(intelligence.channelOpportunities, 'Channel opportunity'));
  addSheet(workbook, 'Positioning', textRows(intelligence.positioningRecommendations, 'Positioning recommendation'));
  addSheet(workbook, 'Action matrix', actionRows(intelligence.actionPriorities));
  addSheet(workbook, 'Risks', textRows(intelligence.commercialRisks, 'Risk or caveat'));
  addSheet(workbook, 'Verification', verificationRows(intelligence));
  addSheet(workbook, 'Limitations', textRows(intelligence.sourceNotesLimitations, 'Source note or limitation'));

  return XLSX.write(workbook, {
    type: 'buffer',
    bookType: 'xlsx'
  }) as Buffer;
}
