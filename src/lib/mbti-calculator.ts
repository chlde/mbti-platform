import { freeQuestions, Question } from './question-bank-free';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type MBTIType =
  | 'ISTJ' | 'ISFJ' | 'INFJ' | 'INTJ'
  | 'ISTP' | 'ISFP' | 'INFP' | 'INTP'
  | 'ESTP' | 'ESFP' | 'ENFP' | 'ENTP'
  | 'ESTJ' | 'ESFJ' | 'ENFJ' | 'ENTJ';

export type Dimension = 'EI' | 'SN' | 'TF' | 'JP';

export interface Answer {
  questionId: number;
  choice: 'A' | 'B';
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
  EI: 'E',
  SN: 'S',
  TF: 'T',
  JP: 'J',
};

const DIMENSION_RIGHT: Record<Dimension, string> = {
  EI: 'I',
  SN: 'N',
  TF: 'F',
  JP: 'P',
};

/**
 * Build a fast lookup map: questionId → Question
 */
function buildQuestionMap(questions: Question[]): Map<number, Question> {
  const map = new Map<number, Question>();
  for (const q of questions) {
    map.set(q.id, q);
  }
  return map;
}

// Pre-build the map once (module-level cache).
const questionMap = buildQuestionMap(freeQuestions);

// ---------------------------------------------------------------------------
// Core calculator
// ---------------------------------------------------------------------------

/**
 * Calculate the full MBTI result from an array of answers.
 *
 * Scoring logic per question:
 *   - Each question belongs to one of four dimensions (EI, SN, TF, JP).
 *   - `weightA` tells us which pole option-A leans toward:
 *       `'left'`  → A scores for the left pole  (E/S/T/J)
 *       `'right'` → A scores for the right pole (I/N/F/P)
 *   - Picking the opposite option naturally scores for the other pole.
 *   - Within a dimension the `ratio` is:  rightCount / totalAnswered
 *       0   → fully left pole
 *       1   → fully right pole
 *       0.5 → perfectly balanced
 *
 * @param answers  Array of { questionId, choice } responses.
 * @param questions  Optional custom question array (defaults to `freeQuestions`).
 */
export function calculateMBTI(
  answers: Answer[],
  questions: Question[] = freeQuestions,
): MBTIResult {
  // Build lookup from the provided (or default) question bank.
  const qMap = questions === freeQuestions
    ? questionMap
    : buildQuestionMap(questions);

  // Accumulate left / right counts per dimension.
  const counts: Record<Dimension, { left: number; right: number }> = {
    EI: { left: 0, right: 0 },
    SN: { left: 0, right: 0 },
    TF: { left: 0, right: 0 },
    JP: { left: 0, right: 0 },
  };

  for (const answer of answers) {
    const question = qMap.get(answer.questionId);
    if (!question) {
      // Skip unknown question IDs gracefully.
      continue;
    }

    const dim = question.dimension;
    const isLeft = answer.choice === 'A'
      ? question.weightA === 'left'
      : question.weightA !== 'left';   // choice B flips the weight

    if (isLeft) {
      counts[dim].left += 1;
    } else {
      counts[dim].right += 1;
    }
  }

  // Derive DimensionScore for each dimension.
  const dimensionScores: Record<Dimension, DimensionScore> = {} as Record<Dimension, DimensionScore>;

  for (const dim of ['EI', 'SN', 'TF', 'JP'] as Dimension[]) {
    const { left, right } = counts[dim];
    const total = left + right;

    const ratio = total === 0 ? 0.5 : right / total;   // neutral when unanswered
    const leftPct  = total === 0 ? 50 : Math.round((left / total) * 100);
    const rightPct = total === 0 ? 50 : Math.round((right / total) * 100);

    const winner = ratio > 0.5
      ? DIMENSION_RIGHT[dim]
      : DIMENSION_LEFT[dim];    // tie → left pole wins by convention

    dimensionScores[dim] = {
      ratio,
      left: leftPct,
      right: rightPct,
      winner,
      answered: total,
    };
  }

  // Assemble the four-letter MBTI type.
  const type = (
    dimensionScores.EI.winner +
    dimensionScores.SN.winner +
    dimensionScores.TF.winner +
    dimensionScores.JP.winner
  ) as MBTIType;

  // Determine overall confidence.
  const confidence = computeConfidence(dimensionScores);

  // Build human-readable summary lines.
  const summary = (['EI', 'SN', 'TF', 'JP'] as Dimension[]).map((dim) => {
    const score = dimensionScores[dim];
    return `${DIMENSION_LEFT[dim]} ${score.left}% · ${DIMENSION_RIGHT[dim]} ${score.right}%`;
  });

  return { type, dimensions: dimensionScores, confidence, summary };
}

// ---------------------------------------------------------------------------
// Confidence
// ---------------------------------------------------------------------------

/**
 * Confidence is derived from the average absolute distance of each dimension's
 * ratio from 0.5 (the neutral midpoint).
 *
 *   avg distance ≥ 0.30  →  "high"
 *   avg distance ≥ 0.15  →  "medium"
 *   otherwise            →  "low"
 *
 * Dimensions with zero answered questions are treated as neutral (0.5),
 * which pulls confidence toward "low".
 */
function computeConfidence(
  dims: Record<Dimension, DimensionScore>,
): ConfidenceLevel {
  const dimensionKeys: Dimension[] = ['EI', 'SN', 'TF', 'JP'];

  let totalDistance = 0;
  let answeredCount = 0;

  for (const dim of dimensionKeys) {
    const score = dims[dim];
    if (score.answered === 0) continue;   // skip unanswered dimensions
    totalDistance += Math.abs(score.ratio - 0.5);
    answeredCount += 1;
  }

  if (answeredCount === 0) return 'low';

  const avgDistance = totalDistance / answeredCount;

  if (avgDistance >= 0.30) return 'high';
  if (avgDistance >= 0.15) return 'medium';
  return 'low';
}

// ---------------------------------------------------------------------------
// Convenience: calculate from simple { questionId, choice } objects
// ---------------------------------------------------------------------------

/**
 * Quick one-liner if you already have answers in the expected format.
 *
 * ```ts
 * import { quickCalc } from './mbti-calculator';
 * const result = quickCalc([
 *   { questionId: 1, choice: 'A' },
 *   { questionId: 2, choice: 'B' },
 *   ...
 * ]);
 * ```
 */
export function quickCalc(answers: Answer[]): MBTIResult {
  return calculateMBTI(answers);
}

/**
 * Utility: get just the four-letter type string.
 */
export function getMBTIType(answers: Answer[]): MBTIType {
  return calculateMBTI(answers).type;
}
