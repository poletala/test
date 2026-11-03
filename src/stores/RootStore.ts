import type { Question } from '../types';
import { ProgressStore } from './ProgressStore';
import { QuizStore } from './QuizStore';
import { UiStore } from './UiStore';

export class RootStore {
  readonly progress: ProgressStore;
  readonly quiz: QuizStore;
  readonly ui: UiStore;
  readonly questions: readonly Question[];

  constructor(questions: readonly Question[]) {
    this.questions = questions;
    this.progress = new ProgressStore();
    this.quiz = new QuizStore(this.progress, questions);
    this.ui = new UiStore();
  }
}
