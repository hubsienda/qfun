import OpenAI from 'openai';
import { env, requireServerEnv } from '@/lib/config';
import {
  addJobLog,
  addReportRecord,
  getJobWithClientAndReports,
  replaceJobCandidates,
  updateJobDiscoveryStatus,
  updateJobStatus
} from '@/lib/qoobix/db';
import { runDiscovery } from '@/lib/qoobix/discovery';
import { buildMarketIntelligencePrompt } from '@/lib/qoobix/prompts';
import { createCsvExport } from '@/lib/qoobix/report-csv';
import { createDocxReport } from '@/lib/qoobix/report-docx';
import { createMarkdownReport } from '@/lib/qoobix/report-md';
import { createRtfReport } from '@/lib/qoobix/report-rtf';
import { createXlsxWorkbook } from '@/lib/qoobix/report-xlsx';
import { uploadGeneratedReport } from '@/lib/qoobix/storage';
import type {
  DiscoveryCandidate,
  GeneratedIntelligence,
  IntelligenceRequest
} from '@/lib/qoobix/types';

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

function cleanReportText(value: unknown, fallback = '') {
  return asString(value, fallback)
    .replace(/\bUnverified\b/g, 'Candidate for verification')
    .replace(/\bunverified\b/g, 'candidate for verification')
    .replace(/Unverified;/g, 'Candidate for verification.')
    .replace(/unverified;/g, 'candidate for verification.');
}

function asStringArray(value: unknown, fallback: string[] = []) {
  if (Array.isArray(value)) {
    return value
      .map((item) => cleanReportText(item))
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === 'string' && value.trim()) {
    return [cleanReportText(value)];
  }

  if (value && typeof value === 'object') {
    return Object.values(value)
      .map((item) => cleanReportText(item))
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
      name: cleanReportText(row.name, 'Potential partner/prospect'),
      category: cleanReportText(row.category, 'Candidate'),
      countryOrRegion: cleanReportText(row.countryOrRegion, 'To check'),
      locality: cleanReportText(row.locality, ''),
      region: cleanReportText(row.region, ''),
      placeId: cleanReportText(row.placeId, ''),
      rating: cleanReportText(row.rating, ''),
      reviewCount: cleanReportText(row.reviewCount, ''),
      businessStatus: cleanReportText(row.businessStatus, ''),
      sourceQuery: cleanReportText(row.sourceQuery, ''),
      source: cleanReportText(row.source, ''),
      relevance: cleanReportText(row.relevance, 'Commercial fit to check.'),
      suggestedAction: cleanReportText(row.suggestedAction, 'Check and qualify before outreach.'),
      website: cleanReportText(row.website, ''),
      verificationUrl: cleanReportText(row.verificationUrl, ''),
      status: cleanReportText(row.status, 'Candidate organisation for verification'),
      notes: cleanReportText(row.notes, 'Candidate organisation for verification. Check service scope before use.')
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
      name: cleanReportText(row.name, 'Competitor/alternative'),
      type: cleanReportText(row.type, 'Candidate'),
      countryOrRegion: cleanReportText(row.countryOrRegion, 'To check'),
      locality: cleanReportText(row.locality, ''),
      region: cleanReportText(row.region, ''),
      placeId: cleanReportText(row.placeId, ''),
      rating: cleanReportText(row.rating, ''),
      reviewCount: cleanReportText(row.reviewCount, ''),
      businessStatus: cleanReportText(row.businessStatus, ''),
      sourceQuery: cleanReportText(row.sourceQuery, ''),
      source: cleanReportText(row.source, ''),
      relevance: cleanReportText(row.relevance, 'Commercial relevance to check.'),
      website: cleanReportText(row.website, ''),
      verificationUrl: cleanReportText(row.verificationUrl, ''),
      status: cleanReportText(row.status, 'Candidate organisation for verification'),
      notes: cleanReportText(row.notes, 'Candidate organisation for verification. Check service scope before use.')
    };
  });
}

function createFallbackIntelligence(request: IntelligenceRequest): GeneratedIntelligence {
  return {
    executiveSummary:
      'This preliminary intelligence report was generated without a completed AI response. It preserves the requested structure and should be treated as a placeholder requiring manual review.',
    clientProductContext: request.productOrService,
    targetMarketOverview: `Target market requested: ${request.targetCountries}. Target geography: ${request.targetGeography || 'Not specified'}.`,
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
      'No completed AI response was available for this job.',
      'All opportunities must be checked before commercial use.'
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
    executiveSummary: cleanReportText(value.executiveSummary, fallback.executiveSummary),
    clientProductContext: cleanReportText(value.clientProductContext, fallback.clientProductContext),
    targetMarketOverview: cleanReportText(value.targetMarketOverview, fallback.targetMarketOverview),

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
          'You are Proteus for QOOBIX IDAAS. Return only valid JSON. Analyse the job subject, not the operator account. Be commercially useful, sceptical, and precise. Preserve website and verificationUrl fields exactly when supplied. Do not invent websites. Do not put Google Maps URLs in website fields. Use Candidate organisation for verification.'
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

function buildDiscoveryNoteSummary(input: {
  candidates: DiscoveryCandidate[];
  notes: string[];
  textSearchCallsUsed: number;
}) {
  const notes = [
    `Discovery candidates retained: ${input.candidates.length}.`,
    `Google Places text-search calls used: ${input.textSearchCallsUsed}.`,
    ...input.notes
  ];

  return notes;
}

function candidateToPartnerRow(candidate: DiscoveryCandidate): GeneratedIntelligence['potentialPartnersProspects'][number] {
  return {
    name: candidate.name,
    category: candidate.categoryLabel || candidate.candidateType,
    countryOrRegion: candidate.countryOrRegion ?? '',
    locality: candidate.locality ?? '',
    region: candidate.region ?? '',
    placeId: candidate.placeId ?? '',
    rating: candidate.rating === null ? '' : String(candidate.rating),
    reviewCount: candidate.reviewCount === null ? '' : String(candidate.reviewCount),
    businessStatus: candidate.businessStatus ?? '',
    sourceQuery: candidate.sourceQuery,
    source: candidate.source,
    relevance: candidate.relevanceReason,
    suggestedAction: candidate.suggestedAction,
    website: candidate.website ?? '',
    verificationUrl: candidate.verificationUrl ?? '',
    status: 'Candidate organisation for verification',
    notes: candidate.website
      ? 'Website captured separately from verification URL. Verify before use.'
      : `Website not supplied. Reason: ${candidate.websiteAbsenceReason ?? 'not returned by source'}.`
  };
}

function candidateToCompetitorRow(candidate: DiscoveryCandidate): GeneratedIntelligence['competitorRows'][number] {
  return {
    name: candidate.name,
    type: candidate.categoryLabel || candidate.candidateType,
    countryOrRegion: candidate.countryOrRegion ?? '',
    locality: candidate.locality ?? '',
    region: candidate.region ?? '',
    placeId: candidate.placeId ?? '',
    rating: candidate.rating === null ? '' : String(candidate.rating),
    reviewCount: candidate.reviewCount === null ? '' : String(candidate.reviewCount),
    businessStatus: candidate.businessStatus ?? '',
    sourceQuery: candidate.sourceQuery,
    source: candidate.source,
    relevance: candidate.relevanceReason,
    website: candidate.website ?? '',
    verificationUrl: candidate.verificationUrl ?? '',
    status: 'Candidate organisation for verification',
    notes: candidate.website
      ? 'Website captured separately from verification URL. Verify before use.'
      : `Website not supplied. Reason: ${candidate.websiteAbsenceReason ?? 'not returned by source'}.`
  };
}

function mergeDiscoveryFieldsIntoIntelligence(input: {
  intelligence: GeneratedIntelligence;
  discoveryCandidates: DiscoveryCandidate[];
  request: IntelligenceRequest;
}) {
  const { intelligence, discoveryCandidates, request } = input;
  const acceptedCandidates = discoveryCandidates.filter(
    (candidate) => candidate.relevanceStatus === 'accepted' && candidate.exportStatus === 'included'
  );
  const candidateByName = new Map(
    acceptedCandidates.map((candidate) => [candidate.name.toLowerCase(), candidate])
  );
  const isCompetitorJob = request.commercialObjective.toLowerCase().includes('competitor');
  const discoveryPartnerRows = acceptedCandidates.map(candidateToPartnerRow);
  const discoveryCompetitorRows = acceptedCandidates.map(candidateToCompetitorRow);

  const partnerRows = intelligence.potentialPartnersProspects.map((row) => {
    const candidate = candidateByName.get(row.name.toLowerCase());

    return {
      ...row,
      website: row.website || candidate?.website || '',
      verificationUrl: row.verificationUrl || candidate?.verificationUrl || '',
      locality: row.locality || candidate?.locality || '',
      region: row.region || candidate?.region || '',
      placeId: row.placeId || candidate?.placeId || '',
      rating: row.rating || (candidate?.rating === null || candidate?.rating === undefined ? '' : String(candidate.rating)),
      reviewCount:
        row.reviewCount ||
        (candidate?.reviewCount === null || candidate?.reviewCount === undefined
          ? ''
          : String(candidate.reviewCount)),
      businessStatus: row.businessStatus || candidate?.businessStatus || '',
      sourceQuery: row.sourceQuery || candidate?.sourceQuery || '',
      source: row.source || candidate?.source || '',
      status: row.status || 'Candidate organisation for verification'
    };
  });

  const competitorRows = intelligence.competitorRows.map((row) => {
    const candidate = candidateByName.get(row.name.toLowerCase());

    return {
      ...row,
      website: row.website || candidate?.website || '',
      verificationUrl: row.verificationUrl || candidate?.verificationUrl || '',
      locality: row.locality || candidate?.locality || '',
      region: row.region || candidate?.region || '',
      placeId: row.placeId || candidate?.placeId || '',
      rating: row.rating || (candidate?.rating === null || candidate?.rating === undefined ? '' : String(candidate.rating)),
      reviewCount:
        row.reviewCount ||
        (candidate?.reviewCount === null || candidate?.reviewCount === undefined
          ? ''
          : String(candidate.reviewCount)),
      businessStatus: row.businessStatus || candidate?.businessStatus || '',
      sourceQuery: row.sourceQuery || candidate?.sourceQuery || '',
      source: row.source || candidate?.source || '',
      status: row.status || 'Candidate organisation for verification'
    };
  });

  return {
    ...intelligence,
    potentialPartnersProspects:
      request.intelligenceMode === 'discovery' && !isCompetitorJob
        ? discoveryPartnerRows
        : partnerRows,
    competitorRows:
      request.intelligenceMode === 'discovery' && isCompetitorJob
        ? discoveryCompetitorRows
        : competitorRows
  };
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

    let discoveryCandidates: DiscoveryCandidate[] = [];
    let discoveryNotes: string[] = [];

    if (request.intelligenceMode === 'discovery') {
      await updateJobDiscoveryStatus({
        jobId,
        discoveryStatus: 'running'
      });

      await addJobLog(jobId, 'info', 'Discovery started.');

      try {
        const discovery = await runDiscovery({
          client,
          request
        });

        discoveryCandidates = discovery.candidates;
        discoveryNotes = buildDiscoveryNoteSummary({
          candidates: discovery.candidates,
          notes: discovery.notes,
          textSearchCallsUsed: discovery.usage.textSearchCallsUsed
        });

        await replaceJobCandidates({
          jobId,
          candidates: discovery.candidates
        });

        await updateJobDiscoveryStatus({
          jobId,
          discoveryStatus: 'completed',
          usage: discovery.usage
        });

        await addJobLog(jobId, 'info', 'Discovery completed.', {
          searchQueries: discovery.searchQueries,
          usage: discovery.usage,
          retainedCandidates: discovery.candidates.length
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Discovery failed.';

        await updateJobDiscoveryStatus({
          jobId,
          discoveryStatus: 'failed'
        });

        await addJobLog(jobId, 'error', 'Discovery failed. Export stopped.', {
          message
        });

        throw new Error(message);
      }
    } else {
      await updateJobDiscoveryStatus({
        jobId,
        discoveryStatus: 'not_required'
      });
    }

    const prompt = buildMarketIntelligencePrompt({
      client,
      request,
      discoveryCandidates,
      discoveryNotes
    });

    const rawIntelligence = await generateIntelligence({
      request,
      prompt
    });

    const intelligence = mergeDiscoveryFieldsIntoIntelligence({
      intelligence: rawIntelligence,
      discoveryCandidates,
      request
    });

    await updateJobStatus(jobId, 'generating_outputs');
    await addJobLog(jobId, 'info', 'Generating DOCX, XLSX, Markdown, RTF, and CSV outputs.');

    const safeClientSlug = client.slug.replace(/[^a-z0-9-]/g, '-');
    const dateStamp = new Date().toISOString().slice(0, 10);

    const docxFileName = `${safeClientSlug}-qoobix-report-${dateStamp}.docx`;
    const xlsxFileName = `${safeClientSlug}-qoobix-workbook-${dateStamp}.xlsx`;
    const mdFileName = `${safeClientSlug}-qoobix-report-${dateStamp}.md`;
    const rtfFileName = `${safeClientSlug}-qoobix-google-docs-report-${dateStamp}.rtf`;
    const csvFileName = `${safeClientSlug}-qoobix-candidates-${dateStamp}.csv`;

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

    const mdBuffer = createMarkdownReport({
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
        fileType: 'md' as const,
        fileName: mdFileName,
        contentType: 'text/markdown; charset=utf-8',
        buffer: mdBuffer
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
