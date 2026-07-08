export type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | {
      [key: string]: Json;
    };

export type JobStatus =
  | 'received'
  | 'processing'
  | 'generating_outputs'
  | 'ready'
  | 'failed'
  | 'cancelled';

export type IntelligenceMode = 'analysis' | 'discovery';

export type QOOBIXPlan = 'analysis' | 'analysis_discovery';

export type ReportType = 'docx' | 'xlsx' | 'rtf' | 'csv' | 'md';

export type ClientConfiguration = {
  id: string;
  name: string;
  slug: string;
  sector: string;
  description: string | null;
  website: string | null;
  productsServices: string | null;
  targetCountries: string[];
  targetCustomerTypes: string[];
  targetChannels: string[];
  knownCompetitors: string | null;
  knownRepresentatives: string | null;

  /**
   * Application language.
   * This controls the QOOBIX interface shown to the client.
   */
  preferredLanguage: string;

  /**
   * Default report/output language.
   * This controls the language proposed for generated reports.
   * It must not control the interface language.
   */
  preferredOutputLanguage: string;

  availableReportTypes: string[];
  fileRetentionDays: number;
};

export type DiscoveryCandidate = {
  candidateId: string;
  name: string;
  website: string | null;
  websiteAbsenceReason: string | null;
  verificationUrl: string | null;
  formattedAddress: string | null;
  locality: string | null;
  region: string | null;
  countryOrRegion: string | null;
  placeId: string | null;
  primaryType: string | null;
  businessCategories: string[];
  categoryLabel: string;
  candidateType: string;
  source: 'google_places' | 'manual' | 'other';
  sourceQuery: string;
  rating: number | null;
  reviewCount: number | null;
  businessStatus: string | null;
  phone: string | null;
  relevanceStatus: 'accepted' | 'rejected' | 'needs_review';
  relevanceScore: number;
  relevanceReason: string;
  suggestedAction: string;
  requiresManualReview: boolean;
  rejectionReason: string | null;
  exportStatus: 'included' | 'excluded' | 'needs_review';
  confidence: 'low' | 'medium' | 'high' | 'requires_verification';
  verificationStatus: 'candidate' | 'needs_review' | 'reviewed' | 'rejected';
};

export type DiscoveryUsage = {
  textSearchCallsUsed: number;
  placeDetailsCallsUsed: number;
  candidateOrganisationsFound: number;
  candidateOrganisationsRetained: number;
};

export type IntelligenceRequest = {
  intelligenceMode: IntelligenceMode;
  productOrService: string;
  targetCountries: string;
  targetGeography: string;
  marketQuestion: string;
  commercialObjective: string;
  commercialObjectiveDetails: string;
  discoveryTarget: string;
  includeCategories: string;
  excludeCategories: string;
  targetCustomerTypes: string;
  targetChannels: string;
  knownCompetitors: string;
  knownPartners: string;
  preferredOutputLanguage: string;
  requiredOutputTypes: string[];
};

export type GeneratedIntelligence = {
  executiveSummary: string;
  clientProductContext: string;
  targetMarketOverview: string;
  demandSignals: string[];
  channelOpportunities: string[];
  competitorsAlternatives: string[];
  regionalPriorities: string[];
  positioningRecommendations: string[];
  commercialRisks: string[];
  actionPriorities: string[];
  sourceNotesLimitations: string[];
  potentialPartnersProspects: Array<{
    name: string;
    category: string;
    countryOrRegion: string;
    locality: string;
    region: string;
    placeId: string;
    rating: string;
    reviewCount: string;
    businessStatus: string;
    sourceQuery: string;
    source: string;
    relevance: string;
    suggestedAction: string;
    website: string;
    verificationUrl: string;
    status: string;
    notes: string;
  }>;
  competitorRows: Array<{
    name: string;
    type: string;
    countryOrRegion: string;
    locality: string;
    region: string;
    placeId: string;
    rating: string;
    reviewCount: string;
    businessStatus: string;
    sourceQuery: string;
    source: string;
    relevance: string;
    website: string;
    verificationUrl: string;
    status: string;
    notes: string;
  }>;
};
