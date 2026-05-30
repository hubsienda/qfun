import {
  AlignmentType,
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

function cleanText(value: string | null | undefined) {
  return value && value.trim() ? value : '—';
}

function title(text: string) {
  return new Paragraph({
    text,
    heading: HeadingLevel.TITLE,
    spacing: {
      after: 260
    }
  });
}

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

function subheading(text: string) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: {
      before: 260,
      after: 120
    }
  });
}

function paragraph(text: string) {
  return new Paragraph({
    children: [new TextRun(cleanText(text))],
    spacing: {
      after: 180
    }
  });
}

function smallMuted(text: string) {
  return new Paragraph({
    children: [
      new TextRun({
        text,
        italics: true,
        size: 20,
        color: '746B64'
      })
    ],
    spacing: {
      after: 160
    }
  });
}

function bullet(text: string) {
  return new Paragraph({
    text: cleanText(text),
    bullet: {
      level: 0
    },
    spacing: {
      after: 120
    }
  });
}

function numberedItem(text: string) {
  return new Paragraph({
    text: cleanText(text),
    numbering: {
      reference: 'qoobix-numbering',
      level: 0
    },
    spacing: {
      after: 120
    }
  });
}

function bulletSection(titleText: string, items: string[]) {
  return [heading(titleText), ...(items.length ? items.map(bullet) : [paragraph('—')])];
}

function tableCell(value: string, bold = false) {
  return new TableCell({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: cleanText(value),
            bold
          })
        ],
        spacing: {
          after: 80
        }
      })
    ]
  });
}

function createInfoTable(rows: Array<[string, string]>) {
  return new Table({
    width: {
      size: 100,
      type: WidthType.PERCENTAGE
    },
    rows: rows.map(
      ([label, value]) =>
        new TableRow({
          children: [tableCell(label, true), tableCell(value)]
        })
    )
  });
}

function createPartnerTable(intelligence: GeneratedIntelligence) {
  const rows = [
    new TableRow({
      children: ['Name/category', 'Type', 'Country/region', 'Relevance', 'Suggested action', 'Notes'].map(
        (label) => tableCell(label, true)
      )
    }),
    ...intelligence.potentialPartnersProspects.map(
      (item) =>
        new TableRow({
          children: [
            tableCell(item.name),
            tableCell(item.category),
            tableCell(item.countryOrRegion),
            tableCell(item.relevance),
            tableCell(item.suggestedAction),
            tableCell(item.notes)
          ]
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

function createCompetitorTable(intelligence: GeneratedIntelligence) {
  const rows = [
    new TableRow({
      children: ['Name/category', 'Type', 'Country/region', 'Relevance', 'Notes'].map((label) =>
        tableCell(label, true)
      )
    }),
    ...intelligence.competitorRows.map(
      (item) =>
        new TableRow({
          children: [
            tableCell(item.name),
            tableCell(item.type),
            tableCell(item.countryOrRegion),
            tableCell(item.relevance),
            tableCell(item.notes)
          ]
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

function createActionTable(actions: string[]) {
  const rows = [
    new TableRow({
      children: ['Priority', 'Action', 'Purpose', 'Verification / next evidence'].map((label) =>
        tableCell(label, true)
      )
    }),
    ...(actions.length ? actions : ['—']).map(
      (action, index) =>
        new TableRow({
          children: [
            tableCell(String(index + 1)),
            tableCell(action),
            tableCell('Turn the intelligence into a practical commercial step.'),
            tableCell('Confirm with direct source checks, market evidence, buyer/channel feedback, or internal review.')
          ]
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

function createVerificationTable(intelligence: GeneratedIntelligence) {
  const rows = [
    new TableRow({
      children: ['Area to verify', 'Why it matters', 'Suggested verification action'].map((label) =>
        tableCell(label, true)
      )
    }),
    ...intelligence.sourceNotesLimitations.map(
      (note) =>
        new TableRow({
          children: [
            tableCell(note),
            tableCell('Reduces the risk of acting on incomplete or uncertain intelligence.'),
            tableCell('Check primary sources, official directories, trade bodies, buyer feedback, distributor confirmation, or direct outreach.')
          ]
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
    numbering: {
      config: [
        {
          reference: 'qoobix-numbering',
          levels: [
            {
              level: 0,
              format: 'decimal',
              text: '%1.',
              alignment: AlignmentType.LEFT
            }
          ]
        }
      ]
    },
    sections: [
      {
        properties: {},
        children: [
          title('QOOBIX Market Intelligence Report'),

          new Paragraph({
            children: [
              new TextRun({
                text: 'Generated by QOOBIX · Managed by Proteus',
                bold: true
              })
            ],
            alignment: AlignmentType.LEFT,
            spacing: {
              after: 160
            }
          }),

          smallMuted(
            'AI-assisted market intelligence. Verify all outputs before commercial, legal, regulatory, technical, financial, or strategic use.'
          ),

          createInfoTable([
            ['Client', client.name],
            ['Sector', client.sector],
            ['Product/service analysed', request.productOrService],
            ['Target country/countries', request.targetCountries],
            ['Commercial objective', request.commercialObjective],
            ['Market question', request.marketQuestion],
            ['Generated', new Date().toLocaleDateString('en-GB')],
            ['Report retention', `${client.fileRetentionDays} day(s), unless cleaned earlier after expiry`]
          ]),

          heading('1. Decision brief'),
          paragraph(intelligence.executiveSummary),

          subheading('Commercial meaning'),
          paragraph(
            'This briefing is designed to support commercial prioritisation. It should be treated as a decision aid, not as a substitute for source verification, direct market contact, or professional judgement.'
          ),

          heading('2. Client and product context'),
          paragraph(intelligence.clientProductContext),

          heading('3. Target market overview'),
          paragraph(intelligence.targetMarketOverview),

          ...bulletSection('4. Demand signals to investigate', intelligence.demandSignals),

          ...bulletSection('5. Channel opportunities', intelligence.channelOpportunities),

          heading('6. Potential partners, prospects, or useful market entry points'),
          intelligence.potentialPartnersProspects.length
            ? createPartnerTable(intelligence)
            : paragraph('No structured partner/prospect rows were generated.'),

          heading('7. Competitor, substitute, and alternative landscape'),
          intelligence.competitorRows.length
            ? createCompetitorTable(intelligence)
            : paragraph('No structured competitor/alternative rows were generated.'),

          subheading('Competitor and substitute notes'),
          ...(intelligence.competitorsAlternatives.length
            ? intelligence.competitorsAlternatives.map(bullet)
            : [paragraph('—')]),

          ...bulletSection('8. Regional or segment priorities', intelligence.regionalPriorities),

          ...bulletSection('9. Positioning recommendations', intelligence.positioningRecommendations),

          ...bulletSection('10. Commercial risks and caveats', intelligence.commercialRisks),

          heading('11. Action matrix'),
          createActionTable(intelligence.actionPriorities),

          heading('12. Verification workflow'),
          intelligence.sourceNotesLimitations.length
            ? createVerificationTable(intelligence)
            : paragraph('No specific source or verification notes were generated.'),

          heading('Final verification notice'),
          paragraph(
            'This report is AI-assisted and may contain incomplete, outdated, or unverified information. Named entities, market claims, competitor references, regulatory assumptions, and commercial recommendations must be verified before use. QOOBIX does not replace professional judgement, source verification, commercial due diligence, legal advice, financial advice, technical assessment, or regulatory review.'
          )
        ]
      }
    ]
  });

  return Packer.toBuffer(document);
}
