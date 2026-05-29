import {
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType
} from 'docx';
import type {
  ClientConfiguration,
  GeneratedIntelligence,
  IntelligenceRequest
} from '@/lib/qoobix/types';

type CreateDocxReportInput = {
  client: ClientConfiguration;
  request: IntelligenceRequest;
  intelligence: GeneratedIntelligence;
};

function heading(text: string) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: {
      before: 420,
      after: 180
    }
  });
}

function paragraph(text: string) {
  return new Paragraph({
    children: [new TextRun(text || '—')],
    spacing: {
      after: 180
    }
  });
}

function bullet(text: string) {
  return new Paragraph({
    text,
    bullet: {
      level: 0
    },
    spacing: {
      after: 120
    }
  });
}

function bulletSection(title: string, items: string[]) {
  return [heading(title), ...(items.length ? items.map(bullet) : [paragraph('—')])];
}

function createPartnerTable(intelligence: GeneratedIntelligence) {
  const rows = [
    new TableRow({
      children: ['Name', 'Category', 'Country/Region', 'Relevance', 'Suggested action', 'Notes'].map(
        (label) =>
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: label, bold: true })]
              })
            ]
          })
      )
    }),
    ...intelligence.potentialPartnersProspects.map(
      (item) =>
        new TableRow({
          children: [
            item.name,
            item.category,
            item.countryOrRegion,
            item.relevance,
            item.suggestedAction,
            item.notes
          ].map(
            (value) =>
              new TableCell({
                children: [paragraph(value)]
              })
          )
        })
    )
  ];

  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE
    },
    rows
  });
}

export async function createDocxReport(input: CreateDocxReportInput): Promise<Buffer> {
  const { client, request, intelligence } = input;

  const document = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: 'QOOBIX Market Intelligence Report',
            heading: HeadingLevel.TITLE,
            spacing: {
              after: 260
            }
          }),

          paragraph(`Client: ${client.name}`),
          paragraph(`Sector: ${client.sector}`),
          paragraph(`Question: ${request.marketQuestion}`),
          paragraph(`Generated: ${new Date().toLocaleDateString('en-GB')}`),

          heading('1. Executive summary'),
          paragraph(intelligence.executiveSummary),

          heading('2. Client/product context'),
          paragraph(intelligence.clientProductContext),

          heading('3. Target market overview'),
          paragraph(intelligence.targetMarketOverview),

          ...bulletSection('4. Demand signals', intelligence.demandSignals),
          ...bulletSection('5. Channel opportunities', intelligence.channelOpportunities),
          ...bulletSection(
            '6. Competitor and alternative landscape',
            intelligence.competitorsAlternatives
          ),
          ...bulletSection('7. Regional or segment priorities', intelligence.regionalPriorities),
          ...bulletSection(
            '8. Positioning recommendations',
            intelligence.positioningRecommendations
          ),
          ...bulletSection('9. Commercial risks and caveats', intelligence.commercialRisks),
          ...bulletSection('10. Action priorities', intelligence.actionPriorities),

          heading('Potential partners/prospects'),
          intelligence.potentialPartnersProspects.length
            ? createPartnerTable(intelligence)
            : paragraph('No structured partner/prospect rows were generated.'),

          ...bulletSection(
            '11. Source notes / limitations',
            intelligence.sourceNotesLimitations
          )
        ]
      }
    ]
  });

  return Packer.toBuffer(document);
}
