interface Answer {
  questionId: string;
  answer: any;
  isCorrect: boolean | null;
  timeSpent?: number;
}

interface Question {
  id: string;
  category: string;
  difficulty: number;
  type: string;
}

export interface DomainScores {
  iq?: {
    visualReasoning: number;
    numericalAnalysis: number;
    verbalIntelligence: number;
    spatialReasoning: number;
  };
  eq?: {
    selfAwareness: number;
    selfControl: number;
    empathy: number;
    motivation: number;
    socialSkills: number;
  };
  sq?: {
    values: number;
    purpose: number;
    connection: number;
    compassion: number;
    ethics: number;
  };
  leadership?: {
    vision: number;
    empathy: number;
    resilience: number;
    ethics: number;
    drive: number;
  };
}

export function calculateIQScore(
  answers: Answer[],
  questions: Question[]
): { score: number; percentile: number; reasoningType: string } {
  // Calculate raw score based on correctness and difficulty
  let totalScore = 0;
  let maxScore = 0;

  answers.forEach((answer) => {
    const question = questions.find((q) => q.id === answer.questionId);
    if (!question || question.category !== 'IQ') return;

    const difficultyWeight = question.difficulty;
    maxScore += difficultyWeight * 10;

    if (answer.isCorrect) {
      totalScore += difficultyWeight * 10;
    }
  });

  // Normalize to 0-200 scale (IQ range)
  const normalizedScore = maxScore > 0 ? (totalScore / maxScore) * 100 + 100 : 100;

  // Calculate percentile (using normal distribution approximation)
  const percentile = calculatePercentile(normalizedScore);

  // Determine reasoning type based on subdomain performance
  const reasoningType = determineReasoningType(answers, questions);

  return {
    score: Math.round(normalizedScore),
    percentile,
    reasoningType,
  };
}

export function calculateEQScore(
  answers: Answer[],
  questions: Question[]
): { score: number; domainScores: DomainScores['eq'] } {
  const domains = {
    selfAwareness: 0,
    selfControl: 0,
    empathy: 0,
    motivation: 0,
    socialSkills: 0,
  };

  let totalScore = 0;
  let maxScore = 0;

  answers.forEach((answer) => {
    const question = questions.find((q) => q.id === answer.questionId);
    if (!question || question.category !== 'EQ') return;

    // EQ uses sentiment-weighted scoring
    const weight = question.difficulty;
    maxScore += weight * 10;

    if (answer.isCorrect !== null && answer.isCorrect) {
      totalScore += weight * 10;
    }

    // Distribute to subdomains (simplified - in production, questions would be tagged)
    const domainIndex = Math.floor(Math.random() * 5);
    const domainKeys = Object.keys(domains) as Array<keyof typeof domains>;
    domains[domainKeys[domainIndex]] += answer.isCorrect ? weight * 2 : 0;
  });

  // Normalize domain scores
  Object.keys(domains).forEach((key) => {
    domains[key as keyof typeof domains] = Math.min(100, (domains[key as keyof typeof domains] / 10) * 10);
  });

  const normalizedScore = maxScore > 0 ? (totalScore / maxScore) * 100 : 50;

  return {
    score: Math.round(normalizedScore),
    domainScores: domains,
  };
}

export function calculateSQScore(
  answers: Answer[],
  questions: Question[]
): { score: number; domainScores: DomainScores['sq'] } {
  const domains = {
    values: 0,
    purpose: 0,
    connection: 0,
    compassion: 0,
    ethics: 0,
  };

  let totalScore = 0;
  let maxScore = 0;

  answers.forEach((answer) => {
    const question = questions.find((q) => q.id === answer.questionId);
    if (!question || question.category !== 'SQ') return;

    const weight = question.difficulty;
    maxScore += weight * 10;

    if (answer.isCorrect !== null && answer.isCorrect) {
      totalScore += weight * 10;
    }

    // Distribute to subdomains
    const domainIndex = Math.floor(Math.random() * 5);
    const domainKeys = Object.keys(domains) as Array<keyof typeof domains>;
    domains[domainKeys[domainIndex]] += answer.isCorrect ? weight * 2 : 0;
  });

  // Normalize
  Object.keys(domains).forEach((key) => {
    domains[key as keyof typeof domains] = Math.min(100, (domains[key as keyof typeof domains] / 10) * 10);
  });

  const normalizedScore = maxScore > 0 ? (totalScore / maxScore) * 100 : 50;

  return {
    score: Math.round(normalizedScore),
    domainScores: domains,
  };
}

export function calculateLPI(
  iqScore: number,
  eqScore: number,
  sqScore: number,
  behaviorMetrics: any
): { score: number; style: string; domainScores: DomainScores['leadership'] } {
  // LPI = 0.30*IQ + 0.35*EQ + 0.20*SQ + 0.15*Behavior
  const behaviorScore = calculateBehaviorScore(behaviorMetrics);

  const lpi = (0.3 * iqScore + 0.35 * eqScore + 0.2 * sqScore + 0.15 * behaviorScore) / 100 * 100;

  // Leadership domain scores
  const domains = {
    vision: Math.round((iqScore * 0.7 + sqScore * 0.3)),
    empathy: eqScore,
    resilience: Math.round((eqScore * 0.5 + behaviorScore * 0.5)),
    ethics: sqScore,
    drive: Math.round((iqScore * 0.4 + behaviorScore * 0.6)),
  };

  const style = determineLeadershipStyle(domains);

  return {
    score: Math.round(lpi),
    style,
    domainScores: domains,
  };
}

function calculatePercentile(iqScore: number): number {
  // Approximate using normal distribution (mean=100, sd=15)
  const z = (iqScore - 100) / 15;
  const percentile = normalCDF(z) * 100;
  return Math.round(Math.max(1, Math.min(99, percentile)));
}

function normalCDF(z: number): number {
  // Approximation of standard normal CDF
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const p =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - p : p;
}

function determineReasoningType(answers: Answer[], questions: Question[]): string {
  // Simplified logic - in production, this would analyze subdomain performance
  const types = ['Analytical', 'Creative', 'Practical'];
  return types[Math.floor(Math.random() * types.length)];
}

function calculateBehaviorScore(metrics: any): number {
  // Behavior score based on completion time, consistency, reflection quality
  const baseScore = 70;
  const timeBonus = metrics?.avgTimeSpent < 30 ? 10 : 0;
  const consistencyBonus = metrics?.consistency > 0.8 ? 20 : 10;

  return Math.min(100, baseScore + timeBonus + consistencyBonus);
}

function determineLeadershipStyle(domains: DomainScores['leadership']): string {
  if (!domains) return 'Balanced';

  const { vision, empathy, resilience, ethics, drive } = domains;

  if (vision > 80 && drive > 80) return 'Transformational';
  if (empathy > 80) return 'Empathic';
  if (vision > 80 && ethics > 80) return 'Ethical';
  if (resilience > 80 && drive > 80) return 'Resilient';
  if (vision > 70 && empathy > 70) return 'Strategic';

  return 'Balanced';
}

export function generateBehaviorMetrics(answers: Answer[]): any {
  const avgTimeSpent =
    answers.reduce((sum, a) => sum + (a.timeSpent || 0), 0) / answers.length;

  const consistency = 0.85; // Placeholder

  return {
    avgTimeSpent,
    consistency,
    completionRate: 1.0,
  };
}
