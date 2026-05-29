export const QOOBIX_BRAND = {
  name: 'QOOBIX',
  engine: 'Proteus',
  orange: '#E85A2A'
} as const;

export const DEFAULT_TARGET_CHANNELS = [
  'Distributors',
  'Resellers',
  'Retailers',
  'Installers',
  'Agents',
  'Representatives',
  'Architects',
  'Consultants',
  'Wholesalers',
  'Direct clients',
  'Public bodies',
  'Other'
] as const;

export const DEFAULT_COMMERCIAL_OBJECTIVES = [
  'Market-entry analysis',
  'Distributor discovery',
  'Partner discovery',
  'Competitor mapping',
  'Regional opportunity assessment',
  'Lead/prospect discovery',
  'Positioning analysis',
  'Pricing/channel analysis',
  'Action-priority report'
] as const;

export const DEFAULT_REPORT_TYPES = ['docx', 'xlsx'] as const;

export const JOB_STATUSES = [
  'received',
  'processing',
  'generating_outputs',
  'ready',
  'failed'
] as const;
