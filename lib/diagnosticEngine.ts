import type {
  ComposedDiagnosis,
  DiagnosticAnswer,
  DiagnosticDiagnosis,
  DiagnosticPath,
  DiagnosticQuestion,
  TagScores,
  UserAnswer
} from '@/lib/diagnostics';

export const QUESTIONS_PER_RUN = 3;
export const SIENDA_MEDIA_URL = 'https://siendamedia.com';

export function createInitialScores(path: DiagnosticPath): TagScores {
  return path.tags.reduce<TagScores>((scores, tag) => {
    scores[tag.id] = 0;
    return scores;
  }, {});
}

export function selectQuestions(
  path: DiagnosticPath,
  count = QUESTIONS_PER_RUN,
  seed = 0
): DiagnosticQuestion[] {
  if (!Array.isArray(path.questions) || path.questions.length === 0) {
    return [];
  }

  if (path.questions.length <= count) {
    return path.questions;
  }

  const safeSeed = Number.isFinite(seed) ? Math.abs(Math.floor(seed)) : 0;
  const startIndex = safeSeed % path.questions.length;

  return Array.from({ length: count }, (_, index) => {
    const questionIndex = (startIndex + index) % path.questions.length;
    return path.questions[questionIndex];
  });
}

export function scoreAnswer(scores: TagScores, answer: DiagnosticAnswer): TagScores {
  const nextScores: TagScores = { ...scores };
  const weights = answer.tagWeights ?? {};

  Object.entries(weights).forEach(([tagId, weight]) => {
    if (!Number.isFinite(weight)) {
      return;
    }

    nextScores[tagId] = (nextScores[tagId] ?? 0) + weight;
  });

  return nextScores;
}

export function getTotalScore(scores: TagScores): number {
  return Object.values(scores).reduce((total, value) => total + value, 0);
}

export function getWinningTagId(path: DiagnosticPath, scores: TagScores): string {
  const fallbackTag = path.tags[0]?.id ?? '';
  let winningTag = fallbackTag;
  let winningScore = Number.NEGATIVE_INFINITY;

  path.tags.forEach((tag) => {
    const score = scores[tag.id] ?? 0;

    if (score > winningScore) {
      winningTag = tag.id;
      winningScore = score;
    }
  });

  return winningTag;
}

export function findDiagnosis(
  path: DiagnosticPath,
  scores: TagScores
): DiagnosticDiagnosis {
  const winningTag = getWinningTagId(path, scores);

  return (
    path.diagnoses.find((diagnosis) => diagnosis.tag === winningTag) ??
    path.diagnoses[0] ?? {
      id: 'fallback',
      tag: winningTag,
      title: 'Unclassified Fog',
      severityLabel: 'Unknown contamination',
      proteusVerdict:
        'Proteus found something suspicious but the label fell off during inspection.',
      whatItMeans:
        'The engine could not find a matching diagnosis, which is embarrassing but survivable.',
      realMechanism:
        'A missing diagnosis usually means the content bank needs inspection rather than the user needing a motivational poster.',
      practicalMove:
        'Check the content bank and make sure every tag has a matching diagnosis.',
      freeAntidoteCopy:
        'Free antidote: enter Da Trove and collect whatever Proteus has left near the warning signs.',
      paidAntidoteCopy:
        'Full antidote: visit Sienda Media if the fog persists.',
      shareLine: 'The fog escaped classification. Proteus is displeased.'
    }
  );
}

export function selectFragment(
  fragments: string[] | undefined,
  seed: number,
  fallback: string
): string {
  if (!fragments || fragments.length === 0) {
    return fallback;
  }

  const safeSeed = Number.isFinite(seed) ? Math.abs(Math.floor(seed)) : 0;
  return fragments[safeSeed % fragments.length] ?? fallback;
}

export function composeDiagnosis(
  path: DiagnosticPath,
  scores: TagScores,
  answersGiven: UserAnswer[]
): ComposedDiagnosis {
  const totalScore = getTotalScore(scores);
  const seed = totalScore + answersGiven.length + path.id.length;
  const diagnosis = findDiagnosis(path, scores);

  return {
    diagnosis,
    totalScore,
    openingLine: selectFragment(
      path.fragments.openingLines,
      seed,
      'Proteus has opened the diagnostic tray.'
    ),
    transitionLine: selectFragment(
      path.fragments.transitionLines,
      seed + 3,
      'The fog is being converted into a usable diagnosis.'
    ),
    softSalesLine: selectFragment(
      path.fragments.softSalesLines,
      seed + 7,
      'If this diagnosis felt unpleasantly familiar, the antidote is available.'
    ),
    closingSting: selectFragment(
      path.fragments.closingStings,
      seed + 11,
      'Proteus has concluded the scan and resumed elegant disapproval.'
    )
  };
}

export function buildUserAnswer(
  question: DiagnosticQuestion,
  answer: DiagnosticAnswer
): UserAnswer {
  return {
    questionId: question.id,
    answerId: answer.id,
    isCorrect: answer.id === question.correctAnswerId,
    tagWeights: answer.tagWeights ?? {}
  };
}

export function getSafePaidUrl(path: DiagnosticPath): string {
  return path.products.paid.url || SIENDA_MEDIA_URL;
}

export function getSafeFreeUrl(path: DiagnosticPath): string {
  return path.products.free.url || '/trove';
}
