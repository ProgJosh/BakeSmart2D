import { DIFFICULTIES, type DifficultyId } from '../data/challenges';

export type LOKey = 'LO1' | 'LO2' | 'LO3';

export interface StageRecord {
  label: string;
  score: number;
  max: number;
  feedback: string;
}

export interface ActivityResult {
  lo: LOKey;
  outcome: string;
  difficultyLabel: string;
  stages: StageRecord[];
  total: number;
  maxTotal: number;
  accuracy: number;
  stars: number;
}

class Store {
  difficulty: DifficultyId = 'medium';
  hintsLeft = 0;
  viewedLessons = new Set<string>();
  completedLOs = new Set<LOKey>();
  lastResult: ActivityResult | null = null;

  startActivity(hints: number, difficulty?: DifficultyId): void {
    this.hintsLeft = hints;
    if (difficulty) this.difficulty = difficulty;
  }

  spendHint(): boolean {
    if (this.hintsLeft <= 0) return false;
    this.hintsLeft--;
    return true;
  }

  markViewed(lessonId: string): void {
    this.viewedLessons.add(lessonId);
  }

  finishActivity(lo: LOKey, outcome: string, stages: StageRecord[]): ActivityResult {
    const maxTotal = stages.length * 100;
    const total = stages.reduce((sum, s) => sum + s.score, 0);
    const accuracy = maxTotal > 0 ? Math.round((total / maxTotal) * 100) : 0;
    const stars = accuracy >= 90 ? 3 : accuracy >= 65 ? 2 : accuracy >= 35 ? 1 : 0;
    this.lastResult = {
      lo,
      outcome,
      difficultyLabel: DIFFICULTIES[this.difficulty].label,
      stages,
      total,
      maxTotal,
      accuracy,
      stars
    };
    this.completedLOs.add(lo);
    return this.lastResult;
  }
}

export const GS = new Store();
