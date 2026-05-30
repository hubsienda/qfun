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

function addSheet(workbook: XLSX.WorkBook, name: string, rows: Record<string, string>[]) {
  const worksheet = XLSX.utils.json_to_sheet(rows.length ? rows : [{ Note: 'No rows generated.' }]);
  XLSX.utils.book_append_sheet(workbook, worksheet, name.slice(0, 31));
}

function listRows(items: string[], label: string) {
  return items.map((item, index) => ({
    Rank: String(index + 1),
    [label]: item
  }));
}

function requestSummaryRows(client: ClientConfiguration, request: IntelligenceRequest) {
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
      Field: 'Preferred output language',
      Value: request.preferredOutputLanguage
    },
    {
      Field: 'Generated',
      Value: new Date().toLocaleDateString('en-GB')
    },
    {
      Field: 'Verification notice',
      Value:
        'AI-assisted output. Verify all information before commercial, legal, financial, regulatory, technical, or strategic use.'
    }
  ];
}

export function createXlsxWorkbook(input: CreateXlsxWorkbookInput): Buffer {
  const { client, request, intelligence } = input;
  const workbook = XLSX.utils.book_new();

  addSheet(workbook, 'Request summary', requestSummaryRows(client, request));

  addSheet(workbook, 'Executive summary', [
    {
      Section: 'Executive summary',
      Content: intelligence.executiveSummary
    },
    {
      Section: 'Client/product context',
      Content: intelligence.clientProductContext
    },
    {
      Section: 'Target market overview',
      Content: intelligence.targetMarketOverview
    }
  ]);

  addSheet(workbook, 'Opportunity priorities', listRows(intelligence.regionalPriorities, 'Priority'));

  addSheet(
    workbook,
    'Potential partners',
    intelligence.potentialPartnersProspects.map((item, index) => ({
      Rank: String(index + 1),
      'Name or category': item.name,
      Type: item.category,
      'Country or region': item.countryOrRegion,
      Relevance: item.relevance,
      'Suggested action': item.suggestedAction,
      Notes: item.notes
    }))
  );

  addSheet(
    workbook,
    'Competitors alternatives',
    intelligence.competitorRows.map((item, index) => ({
      Rank: String(index + 1),
      'Name or category': item.name,
      Type: item.type,
      'Country or region': item.countryOrRegion,
      Relevance: item.relevance,
      Notes: item.notes
    }))
  );

  addSheet(workbook, 'Demand signals', listRows(intelligence.demandSignals, 'Signal'));

  addSheet(workbook, 'Channel opportunities', listRows(intelligence.channelOpportunities, 'Opportunity'));

  addSheet(
    workbook,
    'Positioning',
    listRows(intelligence.positioningRecommendations, 'Recommendation')
  );

  addSheet(workbook, 'Recommended actions', listRows(intelligence.actionPriorities, 'Action'));

  addSheet(workbook, 'Risks caveats', listRows(intelligence.commercialRisks, 'Risk or caveat'));

  addSheet(
    workbook,
    'Source limitations',
    listRows(intelligence.sourceNotesLimitations, 'Source note or limitation')
  );

  return XLSX.write(workbook, {
    type: 'buffer',
    bookType: 'xlsx'
  }) as Buffer;
}
