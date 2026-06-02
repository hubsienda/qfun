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

export type ReportType = 'docx' | 'xlsx' | 'rtf' | 'csv';

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
  preferredLanguage: string;
  availableReportTypes: string[];
  fileRetentionDays: number;
};

export type DiscoveryCandidate = {
  name: string;
  website: string | null;
  verificationUrl: string | null;
  formattedAddress: string | null;
  countryOrRegion: string | null;
  placeId: string | null;
  businessCategories: string[];
  candidateType: string;
  source: 'google_places' | 'manual' | 'other';
  relevanceReason: string;
  suggestedAction: string;
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
  marketQuestion: string;
  commercialObjective: string;
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
    relevance: string;
    suggestedAction: string;
    verificationUrl: string;
    status: string;
    notes: string;
  }>;
  competitorRows: Array<{
    name: string;
    type: string;
    countryOrRegion: string;
    relevance: string;
    verificationUrl: string;
    status: string;
    notes: string;
  }>;
};
