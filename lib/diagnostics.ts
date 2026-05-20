export type TagWeights = Record<string, number>;

export type DiagnosticTag = {
  id: string;
  label: string;
};

export type DiagnosticAnswer = {
  id: string;
  text: string;
  tagWeights?: TagWeights;
};

export type DiagnosticQuestion = {
  id: string;
  question: string;
  answers: DiagnosticAnswer[];
  correctAnswerId: string;
  defaultCorrectReaction: string;
  defaultWrongReaction: string;
  realityCheck: string;
  practicalMove: string;
};

export type DiagnosticDiagnosis = {
  id: string;
  tag: string;
  title: string;
  severityLabel: string;
  proteusVerdict: string;
  whatItMeans: string;
  realMechanism: string;
  practicalMove: string;
  freeAntidoteCopy: string;
  paidAntidoteCopy: string;
  shareLine: string;
};

export type DiagnosticProducts = {
  free: {
    title: string;
    label: string;
    url: string;
    copy: string;
  };
  paid: {
    title: string;
    label: string;
    url: string;
    copy: string;
  };
};

export type DiagnosticFragments = {
  openingLines: string[];
  correctReactions: string[];
  wrongReactions: string[];
  transitionLines: string[];
  softSalesLines: string[];
  tryAnotherChamberLines: string[];
  closingStings: string[];
};

export type DiagnosticPath = {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  intro: {
    eyebrow: string;
    title: string;
    body: string;
    startButton: string;
  };
  tags: DiagnosticTag[];
  products: DiagnosticProducts;
  questions: DiagnosticQuestion[];
  diagnoses: DiagnosticDiagnosis[];
  fragments: DiagnosticFragments;
};

export type TagScores = Record<string, number>;

export type UserAnswer = {
  questionId: string;
  answerId: string;
  isCorrect: boolean;
  tagWeights: TagWeights;
};

export type ComposedDiagnosis = {
  diagnosis: DiagnosticDiagnosis;
  openingLine: string;
  transitionLine: string;
  softSalesLine: string;
  closingSting: string;
  totalScore: number;
};
