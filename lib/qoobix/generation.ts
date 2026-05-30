import OpenAI from 'openai';
import { env, requireServerEnv } from '@/lib/config';
import {
  addJobLog,
  addReportRecord,
  getJobWithClientAndReports,
  updateJobStatus
} from '@/lib/qoobix/db';
import { buildMarketIntelligencePrompt } from '@/lib/qoobix/prompts';
import { createDocxReport } from '@/lib/qoobix/report-docx';
import { createXlsxWorkbook } from '@/lib/qoobix/report-xlsx';
import { uploadGeneratedReport } from '@/lib/qoobix/storage';
import type { GeneratedIntelligence, IntelligenceRequest } from '@/lib/qoobix/types';

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
      request.targetChannels || 'Identify distributors, resellers, agents, representatives, and direct client categories.'
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

function safeParseGeneratedIntelligence(content: string, request: IntelligenceRequest) {
  try {
    return JSON.parse(content) as GeneratedIntelligence;
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
    await addJobLog(jobId, 'info', 'Generating DOCX and XLSX outputs.');

    const safeClientSlug = client.slug.replace(/[^a-z0-9-]/g, '-');
    const dateStamp = new Date().toISOString().slice(0, 10);

    const docxFileName = `${safeClientSlug}-qoobix-report-${dateStamp}.docx`;
    const xlsxFileName = `${safeClientSlug}-qoobix-workbook-${dateStamp}.xlsx`;

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

    const expiresAt = new Date(
      Date.now() + client.fileRetentionDays * 24 * 60 * 60 * 1000
    ).toISOString();

    const docxUpload = await uploadGeneratedReport({
      jobId,
      fileName: docxFileName,
      contentType:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      buffer: docxBuffer
    });

    const xlsxUpload = await uploadGeneratedReport({
      jobId,
      fileName: xlsxFileName,
      contentType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      buffer: xlsxBuffer
    });

    await addReportRecord({
      jobId,
      fileType: 'docx',
      fileName: docxFileName,
      fileUrl: docxUpload.fileUrl,
      storagePath: docxUpload.storagePath,
      expiresAt
    });

    await addReportRecord({
      jobId,
      fileType: 'xlsx',
      fileName: xlsxFileName,
      fileUrl: xlsxUpload.fileUrl,
      storagePath: xlsxUpload.storagePath,
      expiresAt
    });

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
