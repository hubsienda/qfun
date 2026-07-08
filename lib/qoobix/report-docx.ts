import {
  AlignmentType,
  Document,
  ExternalHyperlink,
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

function cleanText(value: string | null | undefined, fallback = '—') {
  return (value && value.trim() ? value : fallback)
    .replace(/\bUnverified\b/g, 'Candidate for verification')
    .replace(/\bunverified\b/g, 'candidate for verification');
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

function labelParagraph(label: string, value: string | null | undefined) {
  return new Paragraph({
    children: [
      new TextRun({
        text: `${label}: `,
        bold: true
      }),
      new TextRun(cleanText(value, label === 'Website' || label === 'Verification URL' ? 'Not supplied' : '—'))
    ],
    spacing: {
      after: 110
    }
  });
}

function urlParagraph(label: string, value: string | null | undefined) {
  const url = value && value.trim() ? value.trim() : '';

  if (!url) {
    return labelParagraph(label, 'Not supplied');
  }

  return new Paragraph({
    children: [
      new TextRun({
        text: `${label}: `,
        bold: true
      }),
      new ExternalHyperlink({
        link: url,
        children: [
          new TextRun({
            text: 'Open link',
            style: 'Hyperlink'
          })
        ]
      }),
      new TextRun({
        text: ` (${url})`,
        size: 18,
        color: '666666'
      })
    ],
    spacing: {
      after: 110
    }
  });
}

function smallMuted(text: string) {
  return new Paragraph({
    children: [
      new TextRun({
        text: cleanText(text),
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
  const text = cleanText(value);

  return new TableCell({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text,
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

function partnerCards(intelligence: GeneratedIntelligence) {
  if (!intelligence.potentialPartnersProspects.length) {
    return [paragraph('No structured partner/prospect candidate rows were generated.')];
  }

  return intelligence.potentialPartnersProspects.flatMap((item, index) => [
    subheading(`Candidate ${index + 1} — ${cleanText(item.name, 'Candidate organisation')}`),
    labelParagraph('Type', item.category),
    labelParagraph('Location', [item.locality, item.region, item.countryOrRegion].filter(Boolean).join(', ')),
    urlParagraph('Website', item.website),
    urlParagraph('Verification URL', item.verificationUrl),
    labelParagraph('Relevance', item.relevance),
    labelParagraph('Suggested verification action', item.suggestedAction),
    labelParagraph('Notes', item.notes),
    labelParagraph('Status', item.status || 'Candidate organisation for verification')
  ]);
}

function competitorCards(intelligence: GeneratedIntelligence) {
  if (!intelligence.competitorRows.length) {
    return [paragraph('No structured competitor/alternative candidate rows were generated.')];
  }

  return intelligence.competitorRows.flatMap((item, index) => [
    subheading(`Candidate ${index + 1} — ${cleanText(item.name, 'Candidate organisation')}`),
    labelParagraph('Type', item.type),
    labelParagraph('Location', [item.locality, item.region, item.countryOrRegion].filter(Boolean).join(', ')),
    urlParagraph('Website', item.website),
    urlParagraph('Verification URL', item.verificationUrl),
    labelParagraph('Relevance', item.relevance),
    labelParagraph('Suggested verification action', 'Check relevance, positioning, geography, offer, website, active status and whether this is a direct competitor, substitute or local alternative.'),
    labelParagraph('Notes', item.notes),
    labelParagraph('Status', item.status || 'Candidate organisation for verification')
  ]);
}

function createActionTable(actions: string[]) {
  const rows = [
    new TableRow({
      children: ['Priority', 'Action', 'Verification / next evidence'].map((label) =>
        tableCell(label, true)
      )
    }),
    ...(actions.length ? actions : ['—']).map(
      (action, index) =>
        new TableRow({
          children: [
            tableCell(String(index + 1)),
            tableCell(action),
            tableCell(
              'Confirm with direct source checks, market evidence, buyer/channel feedback, or internal review.'
            )
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
            tableCell(
              'Check primary sources, official directories, trade bodies, buyer feedback, distributor confirmation, or direct outreach.'
            )
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
    sections: [
      {
        properties: {},
        children: [
          title('QOOBIX IDAAS Market Intelligence Report'),

          new Paragraph({
            children: [
              new TextRun({
                text: 'Generated by QOOBIX IDAAS · Managed by Proteus',
                bold: true
              })
            ],
            alignment: AlignmentType.LEFT,
            spacing: {
              after: 160
            }
          }),

          smallMuted(
            'AI-assisted, operator-reviewed market intelligence. Check all outputs before commercial, legal, regulatory, technical, financial, or strategic use.'
          ),

          createInfoTable([
            ['Operator workspace', client.name],
            ['Operator sector', client.sector],
            ['Product/service analysed', request.productOrService],
            ['Target country/countries', request.targetCountries],
            ['Target geography', request.targetGeography || 'Not supplied'],
            ['Commercial objective', request.commercialObjective],
            ['Commercial objective details', request.commercialObjectiveDetails || 'Not supplied'],
            ['Discovery target', request.discoveryTarget || 'Not supplied'],
            ['Market question', request.marketQuestion],
            ['Generated', new Date().toLocaleDateString('en-GB')],
            ['Report retention', `${client.fileRetentionDays} day(s), unless cleaned earlier after expiry`]
          ]),

          heading('1. Decision brief'),
          paragraph(intelligence.executiveSummary),

          subheading('Commercial meaning'),
          paragraph(
            'This briefing is designed to support commercial prioritisation. It should be treated as a decision aid, not as a substitute for source checking, direct market contact, or professional judgement.'
          ),

          heading('2. Client and product context'),
          paragraph(intelligence.clientProductContext),

          heading('3. Target market overview'),
          paragraph(intelligence.targetMarketOverview),

          ...bulletSection('4. Demand signals to investigate', intelligence.demandSignals),

          ...bulletSection('5. Channel opportunities', intelligence.channelOpportunities),

          heading('6. Candidate organisations for verification'),
          ...partnerCards(intelligence),

          heading('7. Competitor, substitute, and alternative landscape'),
          ...competitorCards(intelligence),

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
            'This report is AI-assisted and may contain incomplete, outdated, or candidate information requiring review. Named entities, websites, market claims, competitor references, regulatory assumptions, and commercial recommendations must be checked before use. QOOBIX IDAAS does not replace professional judgement, source checking, commercial due diligence, legal advice, financial advice, technical assessment, or regulatory review.'
          )
        ]
      }
    ]
  });

  return Packer.toBuffer(document);
}
