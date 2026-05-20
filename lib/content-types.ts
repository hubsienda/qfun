export type ParsedMarkdown = {
  data: Record<string, string>;
  content: string;
};

export type HomeContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroLine: string;
  heroDescription: string;
  heroButton: string;
  troveButton: string;
  heroSupport: string;

  showEyebrow: string;
  showTitle: string;
  showDescription: string;
  chamberQuestion: string;

  goalverseChamberTitle: string;
  goalverseChamberDescription: string;
  goalverseChamberButton: string;

  punkiaChamberTitle: string;
  punkiaChamberDescription: string;
  punkiaChamberButton: string;

  proteusChamberTitle: string;
  proteusChamberDescription: string;
  proteusChamberButton: string;

  encounterEyebrow: string;
  encounterTitle: string;
  question: string;
  answerA: string;
  answerB: string;
  answerC: string;
  answerD: string;
  correctAnswer: string;

  correctResponse: string;
  correctDiagnosis: string;
  correctDetectedMyth: string;
  correctRealityCheck: string;
  correctRecommendedAntidote: string;

  wrongResponse: string;
  wrongDiagnosis: string;
  wrongDetectedMyth: string;
  wrongRealityCheck: string;
  wrongRecommendedAntidote: string;

  punkiaResponse: string;
  punkiaDiagnosis: string;
  punkiaDetectedMyth: string;
  punkiaRealityCheck: string;
  punkiaRecommendedAntidote: string;

  proteusResponse: string;
  proteusDiagnosis: string;
  proteusDetectedMyth: string;
  proteusRealityCheck: string;
  proteusRecommendedAntidote: string;

  diagnosisLabel: string;
  detectedMythLabel: string;
  realityCheckLabel: string;
  recommendedAntidoteLabel: string;

  goalversePathButton: string;
  punkiaPathButton: string;
  proteusPathButton: string;
  futureAntidotesButton: string;

  bridgeTitle: string;
  bridgeDescription: string;
  bridgeTroveButton: string;
  bridgeStoreButton: string;
};

export type AboutContent = {
  title: string;
  description: string;
  content: string;
};

export type TerritoryContent = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  cardButton: string;
  pageButton: string;
  showStoreLink: string;
  content: string;
};

export type LegalPageContent = {
  slug: string;
  title: string;
  description: string;
  effectiveDate: string;
  content: string;
};
