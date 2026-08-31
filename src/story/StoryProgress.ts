class StoryProgressStore {
  private readonly completed = new Set<string>();
  private readonly currentSteps = new Map<string, string>();

  begin(sequenceId: string, firstStepId: string): string {
    const current = this.currentSteps.get(sequenceId) ?? firstStepId;
    this.currentSteps.set(sequenceId, current);
    return current;
  }

  update(sequenceId: string, stepId: string): void {
    this.currentSteps.set(sequenceId, stepId);
  }

  complete(sequenceId: string): void {
    this.completed.add(sequenceId);
    this.currentSteps.delete(sequenceId);
  }

  isComplete(sequenceId: string): boolean {
    return this.completed.has(sequenceId);
  }

  getCurrent(sequenceId: string): string | undefined {
    return this.currentSteps.get(sequenceId);
  }
}

export const STORY_PROGRESS = new StoryProgressStore();

