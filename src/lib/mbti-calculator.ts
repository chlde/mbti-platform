import { freeQuestions, Question, TOTAL_QUESTIONS } from './question-bank-free';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type MBTIType =
  | 'ISTJ' | 'ISFJ' | 'INFJ' | 'INTJ'
  | 'ISTP' | 'ISFP' | 'INFP' | 'INTP'
  | 'ESTP' | 'ESFP' | 'ENFP' | 'ENTP'
  | 'ESTJ' | 'ESFJ' | 'ENFJ' | 'ENTJ';

export type Dimension = 'EI' | 'SN' | 'TF' | 'JP';

/**
 * 5选项量表：
 *   1 = 完全选A (强烈倾向A端)
 *   2 = 比较选A (倾向A端)
 *   3 = 中立/不确定
 *   4 = 比较选B (倾向B端)
 *   5 = 完全选B (强烈倾向B端)
 */
export interface Answer {
  questionId: number;
  choice: 1 | 2 | 3 | 4 | 5;
}

/** Confidence bucket derived from how decisive the scores are. */
export type ConfidenceLevel = 'high' | 'medium' | 'low';

/**
 * Per-dimension result.
 *   - `ratio`  : 0 = fully left pole (E/S/T/J), 1 = fully right pole (I/N/F/P)
 *   - `left`   : percentage for the left pole  (0-100)
 *   - `right`  : percentage for the right pole (0-100)
 *   - `winner` : the dominant letter for this dimension
 */
export interface DimensionScore {
  ratio: number;        // 0-1, where >0.5 means right pole wins
  left: number;         // 0-100 percentage for left pole
  right: number;        // 0-100 percentage for right pole
  winner: string;       // the single-letter that "wins"
  answered: number;     // how many questions contributed to this dimension
}

export interface MBTIResult {
  type: MBTIType;
  dimensions: Record<Dimension, DimensionScore>;
  confidence: ConfidenceLevel;
  /** Human-readable summary: each dimension shown as "E 30% · I 70%" */
  summary: string[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DIMENSION_LEFT: Record<Dimension, string> = {
  EI: 'E', SN: 'S', TF: 'T', JP: 'J',
};

const DIMENSION_RIGHT: Record<Dimension, string> = {
  EI: 'I', SN: 'N', TF: 'F', JP: 'P',
};

function buildQuestionMap(questions: Question[]): Map<number, Question> {
  const map = new Map<number, Question>();
  for (const q of questions) {
    map.set(q.id, q);
  }
  return map;
}

// ---------------------------------------------------------------------------
// Core calculator
// ---------------------------------------------------------------------------

/**
 * Calculate MBTI from 5-option Likert scale answers.
 *
 * Scoring: each answer maps to a weight toward the A or B pole:
 *   choice 1 (完全选A): +2.0 to A's direction
 *   choice 2 (比较选A): +1.0 to A's direction
 *   choice 3 (中立):    +0.5 to each (essentially no contribution)
 *   choice 4 (比较选B): +1.0 to B's direction
 *   choice 5 (完全选B): +2.0 to B's direction
 */
export function calculateMBTI(
  answers: Answer[],
  questions: Question[] = freeQuestions,
): MBTIResult {
  const qMap = questions === freeQuestions
    ? buildQuestionMap(freeQuestions)
    : buildQuestionMap(questions);

  // Accumulate weighted scores per dimension
  const scores: Record<Dimension, { left: number; right: number; answered: number }> = {
    EI: { left: 0, right: 0, answered: 0 },
    SN: { left: 0, right: 0, answered: 0 },
    TF: { left: 0, right: 0, answered: 0 },
    JP: { left: 0, right: 0, answered: 0 },
  };

  for (const answer of answers) {
    const question = qMap.get(answer.questionId);
    if (!question) continue;

    const dim = question.dimension;

    // Calculate direction weight
    // choice 1-2 = A direction, 4-5 = B direction, 3 = neutral
    let aWeight = 0;
    let bWeight = 0;

    switch (answer.choice) {
      case 1: aWeight = 2.0; break;  // 完全选A
      case 2: aWeight = 1.0; break;  // 比较选A
      case 3: aWeight = 0.5; bWeight = 0.5; break; // 中立
      case 4: bWeight = 1.0; break;  // 比较选B
      case 5: bWeight = 2.0; break;  // 完全选B
    }

    // Map to left/right based on weightA
    if (question.weightA === 'left') {
      scores[dim].left += aWeight;
      scores[dim].right += bWeight;
    } else {
      scores[dim].left += bWeight;
      scores[dim].right += aWeight;
    }
    scores[dim].answered += 1;
  }

  // Derive DimensionScore for each dimension
  const dimensionScores: Record<Dimension, DimensionScore> = {} as Record<Dimension, DimensionScore>;

  for (const dim of ['EI', 'SN', 'TF', 'JP'] as Dimension[]) {
    const { left, right, answered } = scores[dim];
    const total = left + right;

    const ratio = total === 0 ? 0.5 : right / total;
    const leftPct  = total === 0 ? 50 : Math.round((left / total) * 100);
    const rightPct = total === 0 ? 50 : Math.round((right / total) * 100);

    const winner = ratio > 0.5
      ? DIMENSION_RIGHT[dim]
      : DIMENSION_LEFT[dim];

    dimensionScores[dim] = { ratio, left: leftPct, right: rightPct, winner, answered };
  }

  const type = (
    dimensionScores.EI.winner +
    dimensionScores.SN.winner +
    dimensionScores.TF.winner +
    dimensionScores.JP.winner
  ) as MBTIType;

  const confidence = computeConfidence(dimensionScores);

  const summary = (['EI', 'SN', 'TF', 'JP'] as Dimension[]).map((dim) => {
    const s = dimensionScores[dim];
    return `${DIMENSION_LEFT[dim]} ${s.left}% · ${DIMENSION_RIGHT[dim]} ${s.right}%`;
  });

  return { type, dimensions: dimensionScores, confidence, summary };
}

// ---------------------------------------------------------------------------
// Confidence
// ---------------------------------------------------------------------------

function computeConfidence(dims: Record<Dimension, DimensionScore>): ConfidenceLevel {
  let totalDistance = 0;
  let answeredCount = 0;

  for (const dim of ['EI', 'SN', 'TF', 'JP'] as Dimension[]) {
    const score = dims[dim];
    if (score.answered === 0) continue;
    totalDistance += Math.abs(score.ratio - 0.5);
    answeredCount += 1;
  }

  if (answeredCount === 0) return 'low';

  const avgDistance = totalDistance / answeredCount;
  if (avgDistance >= 0.30) return 'high';
  if (avgDistance >= 0.15) return 'medium';
  return 'low';
}

export function quickCalc(answers: Answer[]): MBTIResult {
  return calculateMBTI(answers);
}

export function getMBTIType(answers: Answer[]): MBTIType {
  return calculateMBTI(answers).type;
}
