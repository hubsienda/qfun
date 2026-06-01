import type {
  ClientConfiguration,
  GeneratedIntelligence,
  IntelligenceRequest
} from '@/lib/qoobix/types';

type CreateHtmlReportInput = {
  client: ClientConfiguration;
  request: IntelligenceRequest;
  intelligence: GeneratedIntelligence;
};

function escapeHtml(value: string | null | undefined) {
  return (value && value.trim() ? value : '—')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function list(items: string[]) {
  if (!items.length) {
    return '<p>—</p>';
  }

  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

function infoRow(label: string, value: string) {
  return `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`;
}

function partnerBlocks(intelligence: GeneratedIntelligence) {
  if (!intelligence.potentialPartnersProspects.length) {
    return '<p>No structured partner/prospect rows were generated.</p>';
  }

  return intelligence.potentialPartnersProspects
    .map(
      (item, index) => `
        <article class="record">
          <h3>${index + 1}. ${escapeHtml(item.name)}</h3>
          <p><strong>Type:</strong> ${escapeHtml(item.category)}</p>
          <p><strong>Country/region:</strong> ${escapeHtml(item.countryOrRegion)}</p>
          <p><strong>Relevance:</strong> ${escapeHtml(item.relevance)}</p>
          <p><strong>Suggested action:</strong> ${escapeHtml(item.suggestedAction)}</p>
          <p><strong>Notes:</strong> ${escapeHtml(item.notes)}</p>
        </article>
      `
    )
    .join('');
}

function competitorBlocks(intelligence: GeneratedIntelligence) {
  if (!intelligence.competitorRows.length) {
    return '<p>No structured competitor/alternative rows were generated.</p>';
  }

  return intelligence.competitorRows
    .map(
      (item, index) => `
        <article class="record">
          <h3>${index + 1}. ${escapeHtml(item.name)}</h3>
          <p><strong>Type:</strong> ${escapeHtml(item.type)}</p>
          <p><strong>Country/region:</strong> ${escapeHtml(item.countryOrRegion)}</p>
          <p><strong>Relevance:</strong> ${escapeHtml(item.relevance)}</p>
          <p><strong>Notes:</strong> ${escapeHtml(item.notes)}</p>
        </article>
      `
    )
    .join('');
}

function actionBlocks(actions: string[]) {
  if (!actions.length) {
    return '<p>—</p>';
  }

  return actions
    .map(
      (action, index) => `
        <article class="record">
          <h3>Action ${index + 1}</h3>
          <p>${escapeHtml(action)}</p>
          <p><strong>Purpose:</strong> Turn the intelligence into a practical commercial step.</p>
          <p><strong>Verification:</strong> Confirm with direct source checks, market evidence, buyer/channel feedback, or internal review.</p>
        </article>
      `
    )
    .join('');
}

function verificationBlocks(notes: string[]) {
  if (!notes.length) {
    return '<p>No specific source or verification notes were generated.</p>';
  }

  return notes
    .map(
      (note, index) => `
        <article class="record">
          <h3>Verification item ${index + 1}</h3>
          <p><strong>Area to verify:</strong> ${escapeHtml(note)}</p>
          <p><strong>Why it matters:</strong> Reduces the risk of acting on incomplete or uncertain intelligence.</p>
          <p><strong>Suggested verification:</strong> Check primary sources, official directories, trade bodies, buyer feedback, distributor confirmation, or direct outreach.</p>
        </article>
      `
    )
    .join('');
}

export function createHtmlReport(input: CreateHtmlReportInput): Buffer {
  const { client, request, intelligence } = input;

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>QOOBIX Market Intelligence Report</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body {
      margin: 0;
      background: #fffaf3;
      color: #171310;
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.6;
    }

    main {
      max-width: 980px;
      margin: 0 auto;
      padding: 40px 22px 64px;
    }

    h1 {
      font-size: 34px;
      line-height: 1.15;
      margin: 0 0 16px;
    }

    h2 {
      font-size: 24px;
      margin: 42px 0 12px;
      padding-top: 20px;
      border-top: 1px solid #e5d9ca;
    }

    h3 {
      font-size: 18px;
      margin: 0 0 10px;
    }

    p {
      margin: 0 0 14px;
    }

    ul {
      margin: 0 0 18px 22px;
      padding: 0;
    }

    li {
      margin: 0 0 9px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 22px 0 32px;
      background: #ffffff;
    }

    th,
    td {
      border: 1px solid #e5d9ca;
      padding: 10px 12px;
      vertical-align: top;
      text-align: left;
    }

    th {
      width: 32%;
      background: #f7f3ed;
    }

    .notice {
      padding: 14px 16px;
      border: 1px solid #e5d9ca;
      background: #ffffff;
      color: #746b64;
      margin: 18px 0 26px;
    }

    .record {
      border: 1px solid #e5d9ca;
      background: #ffffff;
      padding: 16px;
      margin: 0 0 14px;
      page-break-inside: avoid;
    }

    .brand {
      color: #e85a2a;
      font-weight: 700;
      letter-spacing: 0.02em;
    }

    @media print {
      body {
        background: #ffffff;
      }

      main {
        max-width: none;
        padding: 24px;
      }

      .record {
        break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <main>
    <p class="brand">Generated by QOOBIX · Managed by Proteus</p>
    <h1>QOOBIX Market Intelligence Report</h1>

    <div class="notice">
      AI-assisted market intelligence. Verify all outputs before commercial, legal, regulatory, technical, financial, or strategic use.
    </div>

    <table>
      <tbody>
        ${infoRow('Client', client.name)}
        ${infoRow('Sector', client.sector)}
        ${infoRow('Product/service analysed', request.productOrService)}
        ${infoRow('Target country/countries', request.targetCountries)}
        ${infoRow('Commercial objective', request.commercialObjective)}
        ${infoRow('Market question', request.marketQuestion)}
        ${infoRow('Generated', new Date().toLocaleDateString('en-GB'))}
        ${infoRow('Report retention', `${client.fileRetentionDays} day(s), unless cleaned earlier after expiry`)}
      </tbody>
    </table>

    <h2>1. Decision brief</h2>
    <p>${escapeHtml(intelligence.executiveSummary)}</p>

    <h2>2. Client and product context</h2>
    <p>${escapeHtml(intelligence.clientProductContext)}</p>

    <h2>3. Target market overview</h2>
    <p>${escapeHtml(intelligence.targetMarketOverview)}</p>

    <h2>4. Demand signals to investigate</h2>
    ${list(intelligence.demandSignals)}

    <h2>5. Channel opportunities</h2>
    ${list(intelligence.channelOpportunities)}

    <h2>6. Potential partners, prospects, or useful market entry points</h2>
    ${partnerBlocks(intelligence)}

    <h2>7. Competitor, substitute, and alternative landscape</h2>
    ${competitorBlocks(intelligence)}

    <h2>8. Competitor and substitute notes</h2>
    ${list(intelligence.competitorsAlternatives)}

    <h2>9. Regional or segment priorities</h2>
    ${list(intelligence.regionalPriorities)}

    <h2>10. Positioning recommendations</h2>
    ${list(intelligence.positioningRecommendations)}

    <h2>11. Commercial risks and caveats</h2>
    ${list(intelligence.commercialRisks)}

    <h2>12. Action matrix</h2>
    ${actionBlocks(intelligence.actionPriorities)}

    <h2>13. Verification workflow</h2>
    ${verificationBlocks(intelligence.sourceNotesLimitations)}

    <h2>Final verification notice</h2>
    <p>
      This report is AI-assisted and may contain incomplete, outdated, or unverified information.
      Named entities, market claims, competitor references, regulatory assumptions, and commercial
      recommendations must be verified before use. QOOBIX does not replace professional judgement,
      source verification, commercial due diligence, legal advice, financial advice, technical
      assessment, or regulatory review.
    </p>
  </main>
</body>
</html>`;

  return Buffer.from(html, 'utf8');
}
