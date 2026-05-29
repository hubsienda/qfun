import type { ClientConfiguration, IntelligenceRequest } from '@/lib/qoobix/types';

export function buildMarketIntelligencePrompt(input: {
  client: ClientConfiguration;
  request: IntelligenceRequest;
}) {
  const { client, request } = input;

  return `
You are Proteus, the proprietary intelligence layer behind QOOBIX.

You must generate structured commercial market intelligence for a private client.

Do not pretend to have live web access unless external browsing has explicitly been provided to you.
If sources are not available, say so clearly in source notes and limitations.
Do not invent exact phone numbers, email addresses, addresses, legal claims, financial figures, or named contacts.
You may suggest categories, search directions, likely channel types, and plausible commercial priorities.
Be practical, sharp, sceptical, and useful. Avoid generic SaaS language.

CLIENT CONFIGURATION

Client name:
${client.name}

Sector:
${client.sector}

Description:
${client.description ?? 'Not provided'}

Website:
${client.website ?? 'Not provided'}

Configured products/services:
${client.productsServices ?? 'Not provided'}

Target countries:
${client.targetCountries.join(', ') || 'Not provided'}

Target customer types:
${client.targetCustomerTypes.join(', ') || 'Not provided'}

Target channels:
${client.targetChannels.join(', ') || 'Not provided'}

Known competitors:
${client.knownCompetitors ?? 'Not provided'}

Known representatives/distributors/partners:
${client.knownRepresentatives ?? 'Not provided'}

Preferred client language:
${client.preferredLanguage}

REQUEST

Product or service to analyse:
${request.productOrService}

Target country/countries:
${request.targetCountries}

Market question:
${request.marketQuestion}

Commercial objective:
${request.commercialObjective}

Target customer types:
${request.targetCustomerTypes}

Target channels:
${request.targetChannels}

Known competitors:
${request.knownCompetitors}

Known partners/distributors/representatives:
${request.knownPartners}

Preferred output language:
${request.preferredOutputLanguage}

Return ONLY valid JSON in this exact structure:

{
  "executiveSummary": "string",
  "clientProductContext": "string",
  "targetMarketOverview": "string",
  "demandSignals": ["string"],
  "channelOpportunities": ["string"],
  "competitorsAlternatives": ["string"],
  "regionalPriorities": ["string"],
  "positioningRecommendations": ["string"],
  "commercialRisks": ["string"],
  "actionPriorities": ["string"],
  "sourceNotesLimitations": ["string"],
  "potentialPartnersProspects": [
    {
      "name": "string",
      "category": "string",
      "countryOrRegion": "string",
      "relevance": "string",
      "suggestedAction": "string",
      "notes": "string"
    }
  ],
  "competitorRows": [
    {
      "name": "string",
      "type": "string",
      "countryOrRegion": "string",
      "relevance": "string",
      "notes": "string"
    }
  ]
}

The final output must be in the preferred output language requested by the client.
`.trim();
}
