export type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | {
      [key: string]: Json;
    };

export type JobStatus = 'received' | 'processing' | 'generating_outputs' | 'ready' | 'failed';

export type ReportType = 'docx' | 'xlsx' | 'csv';

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

export type IntelligenceRequest = {
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
    notes: string;
  }>;
  competitorRows: Array<{
    name: string;
    type: string;
    countryOrRegion: string;
    relevance: string;
    notes: string;
  }>;
};
