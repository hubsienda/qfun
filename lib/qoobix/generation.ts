import OpenAI from 'openai';
import { env, requireServerEnv } from '@/lib/config';
import {
  addJobLog,
  addReportRecord,
  getJobWithClientAndReports,
  updateJobStatus
} from '@/lib/qoobix/db';
import { buildMarketIntelligencePrompt } from '@/lib/qoobix/prompts';
import { createCsvExport } from '@/lib/qoobix/report-csv';
import { createDocxReport } from '@/lib/qoobix/report-docx';
import { createRtfReport } from '@/lib/qoobix/report-rtf';
import { createXlsxWorkbook } from '@/lib/qoobix/report-xlsx';
import { uploadGeneratedReport } from '@/lib/qoobix/storage';
import type { GeneratedIntelligence, IntelligenceRequest } from '@/lib/qoobix/types';

function asString(value: unknown, fallback = '') {
  if (typeof value === 'string') {
    return value.trim() || fallback;
  }

  if (value === null || value === undefined) {
    return fallback;
  }

  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  try {
    return JSON.stringify(value);
  } catch {
    return fallback;
  }
}

function asStringArray(value: unknown, fallback: string[] = []) {
  if (Array.isArray(value)) {
    return value
      .map((item) => asString(item))
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === 'string' && value.trim()) {
    return [value.trim()];
  }

  if (value && typeof value === 'object') {
    return Object.values(value)
      .map((item) => asString(item))
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return fallback;
}

function asPartnerRows(value: unknown): GeneratedIntelligence['potentialPartnersProspects'] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => {
    const row = item && typeof item === 'object' ? (item as Record<string, unknown>) : {};

    return {
      name: asString(row.name, 'Potential partner/prospect'),
      category: asString(row.category, 'To verify'),
      countryOrRegion: asString(row.countryOrRegion, 'To verify'),
      relevance: asString(row.relevance, 'To verify'),
      suggestedAction: asString(row.suggestedAction, 'Verify and qualify before outreach.'),
      notes: asString(row.notes, 'AI-assisted row. Verify before use.')
    };
  });
}

function asCompetitorRows(value: unknown): GeneratedIntelligence['competitorRows'] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => {
    const row = item && typeof item === 'object' ? (item as Record<string, unknown>) : {};

    return {
      name: asString(row.name, 'Competitor/alternative'),
      type: asString(row.type, 'To verify'),
      countryOrRegion: asString(row.countryOrRegion, 'To verify'),
      relevance: asString(row.relevance, 'To verify'),
      notes: asString(row.notes, 'AI-assisted row. Verify before use.')
    };
  });
}

function createFallbackIntelligence(request: IntelligenceRequest): GeneratedIntelligence {
  return {
    executiveSummary:
      'This preliminary intelligence report was generated without a completed AI response. It preserves the requested structure and should be treated as a placeholder requiring manual review.',
    clientProductContext: request.productOrService,
    targetMarketOverview: `Target market requested: ${request.targetCountries}.`,
    demandSignals: [
      'Review sector demand indicators before making commercial commitments.',
      'Validate regional demand using trade associations, public procurement portals, distributor catalogues, and competitor presence.'
    ],
    channelOpportunities: [
      request.targetChannels ||
        'Identify distributors, resellers, agents, representatives, and direct client categories.'
    ],
    competitorsAlternatives: [
      request.knownCompetitors || 'Map direct competitors, substitute products, and local alternatives.'
    ],
    regionalPriorities: [
      'Prioritise regions where target customers, channel partners, and relevant sector activity overlap.'
    ],
    positioningRecommendations: [
      'Position the offer around measurable commercial usefulness, practical reliability, and clear differentiation.'
    ],
    commercialRisks: [
      'Do not rely on AI-generated market lists without human verification.',
      'Confirm legal, regulatory, technical, and commercial assumptions before outreach.'
    ],
    actionPriorities: [
      'Create a verified target list.',
      'Separate high-probability channels from speculative contacts.',
      'Prepare sector-specific outreach messaging.'
    ],
    sourceNotesLimitations: [
      'No live source retrieval was included in this placeholder output.',
      'All opportunities must be verified manually before commercial use.'
    ],
    potentialPartnersProspects: [],
    competitorRows: []
  };
}

function normaliseGeneratedIntelligence(
  raw: unknown,
  request: IntelligenceRequest
): GeneratedIntelligence {
  const fallback = createFallbackIntelligence(request);
  const value = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};

  return {
    executiveSummary: asString(value.executiveSummary, fallback.executiveSummary),
    clientProductContext: asString(value.clientProductContext, fallback.clientProductContext),
    targetMarketOverview: asString(value.targetMarketOverview, fallback.targetMarketOverview),

    demandSignals: asStringArray(value.demandSignals, fallback.demandSignals),
    channelOpportunities: asStringArray(value.channelOpportunities, fallback.channelOpportunities),
    competitorsAlternatives: asStringArray(
      value.competitorsAlternatives,
      fallback.competitorsAlternatives
    ),
    regionalPriorities: asStringArray(value.regionalPriorities, fallback.regionalPriorities),
    positioningRecommendations: asStringArray(
      value.positioningRecommendations,
      fallback.positioningRecommendations
    ),
    commercialRisks: asStringArray(value.commercialRisks, fallback.commercialRisks),
    actionPriorities: asStringArray(value.actionPriorities, fallback.actionPriorities),
    sourceNotesLimitations: asStringArray(
      value.sourceNotesLimitations,
      fallback.sourceNotesLimitations
    ),

    potentialPartnersProspects: asPartnerRows(value.potentialPartnersProspects),
    competitorRows: asCompetitorRows(value.competitorRows)
  };
}

function safeParseGeneratedIntelligence(content: string, request: IntelligenceRequest) {
  try {
    return normaliseGeneratedIntelligence(JSON.parse(content), request);
  } catch {
    return createFallbackIntelligence(request);
  }
}

async function generateIntelligence(input: {
  request: IntelligenceRequest;
  clientName: string;
  prompt: string;
}): Promise<GeneratedIntelligence> {
  const apiKey = requireServerEnv('OPENAI_API_KEY');
  const openai = new OpenAI({ apiKey });

  const completion = await openai.chat.completions.create({
    model: env.OPENAI_MODEL,
    messages: [
      {
        role: 'system',
        content:
          'You are Proteus for QOOBIX. Return only valid JSON. Be commercially useful, sceptical, and precise.'
      },
      {
        role: 'user',
        content: input.prompt
      }
    ],
    response_format: {
      type: 'json_object'
    }
  });

  const content = completion.choices[0]?.message.content ?? '';

  return safeParseGeneratedIntelligence(content, input.request);
}

export async function generateAndStoreJobOutputs(jobId: string) {
  await updateJobStatus(jobId, 'processing');
  await addJobLog(jobId, 'info', 'Generation started.');

  try {
    const data = await getJobWithClientAndReports(jobId);

    if (!data) {
      throw new Error('Job not found.');
    }

    const { job, client } = data;
    const request = job.request_metadata as IntelligenceRequest;
    const prompt = buildMarketIntelligencePrompt({ client, request });

    const intelligence = await generateIntelligence({
      request,
      clientName: client.name,
      prompt
    });

    await updateJobStatus(jobId, 'generating_outputs');
    await addJobLog(jobId, 'info', 'Generating DOCX, XLSX, RTF, and CSV outputs.');

    const safeClientSlug = client.slug.replace(/[^a-z0-9-]/g, '-');
    const dateStamp = new Date().toISOString().slice(0, 10);

    const docxFileName = `${safeClientSlug}-qoobix-report-${dateStamp}.docx`;
    const xlsxFileName = `${safeClientSlug}-qoobix-workbook-${dateStamp}.xlsx`;
    const rtfFileName = `${safeClientSlug}-qoobix-google-docs-report-${dateStamp}.rtf`;
    const csvFileName = `${safeClientSlug}-qoobix-google-sheets-export-${dateStamp}.csv`;

    const docxBuffer = await createDocxReport({
      client,
      request,
      intelligence
    });

    const xlsxBuffer = createXlsxWorkbook({
      client,
      request,
      intelligence
    });

    const rtfBuffer = createRtfReport({
      client,
      request,
      intelligence
    });

    const csvBuffer = createCsvExport({
      client,
      request,
      intelligence
    });

    const expiresAt = new Date(
      Date.now() + client.fileRetentionDays * 24 * 60 * 60 * 1000
    ).toISOString();

    const outputs = [
      {
        fileType: 'docx' as const,
        fileName: docxFileName,
        contentType:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        buffer: docxBuffer
      },
      {
        fileType: 'xlsx' as const,
        fileName: xlsxFileName,
        contentType:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        buffer: xlsxBuffer
      },
      {
        fileType: 'rtf' as const,
        fileName: rtfFileName,
        contentType: 'application/rtf',
        buffer: rtfBuffer
      },
      {
        fileType: 'csv' as const,
        fileName: csvFileName,
        contentType: 'text/csv; charset=utf-8',
        buffer: csvBuffer
      }
    ];

    for (const output of outputs) {
      const uploaded = await uploadGeneratedReport({
        jobId,
        fileName: output.fileName,
        contentType: output.contentType,
        buffer: output.buffer
      });

      await addReportRecord({
        jobId,
        fileType: output.fileType,
        fileName: output.fileName,
        fileUrl: uploaded.fileUrl,
        storagePath: uploaded.storagePath,
        expiresAt
      });
    }

    await updateJobStatus(jobId, 'ready');
    await addJobLog(jobId, 'info', 'Generation completed.');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown generation error.';

    await updateJobStatus(jobId, 'failed', message);
    await addJobLog(jobId, 'error', 'Generation failed.', {
      message
    });

    throw error;
  }
}
