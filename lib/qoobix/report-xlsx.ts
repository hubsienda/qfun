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
    Priority: String(index + 1),
    [label]: item
  }));
}

export function createXlsxWorkbook(input: CreateXlsxWorkbookInput): Buffer {
  const { client, request, intelligence } = input;
  const workbook = XLSX.utils.book_new();

  addSheet(workbook, 'Opportunity priorities', listRows(intelligence.regionalPriorities, 'Priority'));
  addSheet(workbook, 'Potential partners', intelligence.potentialPartnersProspects);
  addSheet(workbook, 'Competitors', intelligence.competitorRows);
  addSheet(workbook, 'Regional notes', listRows(intelligence.demandSignals, 'Signal'));
  addSheet(workbook, 'Recommended actions', listRows(intelligence.actionPriorities, 'Action'));
  addSheet(workbook, 'Source notes', listRows(intelligence.sourceNotesLimitations, 'Limitation'));

  addSheet(workbook, 'Request summary', [
    {
      Field: 'Client',
      Value: client.name
    },
    {
      Field: 'Sector',
      Value: client.sector
    },
    {
      Field: 'Product/service',
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
    }
  ]);

  return XLSX.write(workbook, {
    type: 'buffer',
    bookType: 'xlsx'
  }) as Buffer;
}
