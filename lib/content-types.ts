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
  heroSupport: string;
  encounterEyebrow: string;
  encounterTitle: string;
  question: string;
  answerA: string;
  answerB: string;
  answerC: string;
  answerD: string;
  correctAnswer: string;
  correctResponse: string;
  wrongResponse: string;
  territoriesEyebrow: string;
  territoriesTitle: string;
  bridgeTitle: string;
  bridgeDescription: string;
  bridgeButton: string;
  aboutEyebrow: string;
  aboutTitle: string;
  aboutParagraphOne: string;
  aboutParagraphTwo: string;
  aboutParagraphThree: string;
};

export type TerritoryContent = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  button: string;
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
