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

function boldParagraph(label: string, value: string) {
  return new Paragraph({
    children: [
      new TextRun({
        text: `${label}: `,
        bold: true
      }),
      new TextRun(cleanText(value))
    ],
    spacing: {
      after: 120
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

function partnerRecordBlocks(intelligence: GeneratedIntelligence) {
  if (!intelligence.potentialPartnersProspects.length) {
    return [paragraph('No structured partner/prospect rows were generated.')];
  }

  return intelligence.potentialPartnersProspects.flatMap((item, index) => [
    subheading(`${index + 1}. ${cleanText(item.name)}`),
    boldParagraph('Type', item.category),
    boldParagraph('Country/region', item.countryOrRegion),
    boldParagraph('Relevance', item.relevance),
    boldParagraph('Suggested action', item.suggestedAction),
    boldParagraph('Notes', item.notes)
  ]);
}

function competitorRecordBlocks(intelligence: GeneratedIntelligence) {
  if (!intelligence.competitorRows.length) {
    return [paragraph('No structured competitor/alternative rows were generated.')];
  }

  return intelligence.competitorRows.flatMap((item, index) => [
    subheading(`${index + 1}. ${cleanText(item.name)}`),
    boldParagraph('Type', item.type),
    boldParagraph('Country/region', item.countryOrRegion),
    boldParagraph('Relevance', item.relevance),
    boldParagraph('Notes', item.notes)
  ]);
}

function actionBlocks(actions: string[]) {
  if (!actions.length) {
    return [paragraph('—')];
  }

  return actions.flatMap((action, index) => [
    subheading(`Action ${index + 1}`),
    paragraph(action),
    boldParagraph('Purpose', 'Turn the intelligence into a practical commercial step.'),
    boldParagraph(
      'Verification / next evidence',
      'Confirm with direct source checks, market evidence, buyer/channel feedback, or internal review.'
    )
  ]);
}

function verificationBlocks(notes: string[]) {
  if (!notes.length) {
    return [paragraph('No specific source or verification notes were generated.')];
  }

  return notes.flatMap((note, index) => [
    subheading(`Verification item ${index + 1}`),
    boldParagraph('Area to verify', note),
    boldParagraph(
      'Why it matters',
      'Reduces the risk of acting on incomplete or uncertain intelligence.'
    ),
    boldParagraph(
      'Suggested verification action',
      'Check primary sources, official directories, trade bodies, buyer feedback, distributor confirmation, or direct outreach.'
    )
  ]);
}

export async function createDocxReport(input: CreateDocxReportInput): Promise<Buffer> {
  const { client, request, intelligence } = input;

  const document = new Document({
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
          ...partnerRecordBlocks(intelligence),

          heading('7. Competitor, substitute, and alternative landscape'),
          ...competitorRecordBlocks(intelligence),

          subheading('Competitor and substitute notes'),
          ...(intelligence.competitorsAlternatives.length
            ? intelligence.competitorsAlternatives.map(bullet)
            : [paragraph('—')]),

          ...bulletSection('8. Regional or segment priorities', intelligence.regionalPriorities),

          ...bulletSection('9. Positioning recommendations', intelligence.positioningRecommendations),

          ...bulletSection('10. Commercial risks and caveats', intelligence.commercialRisks),

          heading('11. Action matrix'),
          ...actionBlocks(intelligence.actionPriorities),

          heading('12. Verification workflow'),
          ...verificationBlocks(intelligence.sourceNotesLimitations),

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
