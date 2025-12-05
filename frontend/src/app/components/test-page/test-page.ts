import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Question } from '../../models/question.model';
import { QuestionService } from '../../services/question';

@Component({
  selector: 'app-test-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './test-page.html',
  styleUrl: './test-page.scss'
})
export class TestPageComponent {
  categories = [
    'JavaScript',
    'Angular',
    'HTML/CSS',
    'Web Performance',
    'SEO',
    'Node.js',
    'SQL',
    'Java',
    'Python'
  ];

  selectedCategory = 'JavaScript';
  questionCount = 5;

  allMcq: Question[] = [];
  testQuestions: Question[] = [];
  userAnswers: number[] = [];

  testStarted = false;
  testSubmitted = false;
  score = 0;

  loading = false;
  error = '';

  constructor(private questionService: QuestionService) {}

  startTest(): void {
    this.loading = true;
    this.error = '';
    this.testSubmitted = false;
    this.score = 0;

    this.questionService
      .getQuestions({ category: this.selectedCategory })
      .subscribe({
        next: (data: Question[]) => {
          // filter only MCQ
          const mcq = data.filter(q => q.type === 'mcq' && q.options && q.options.length >= 2);

          if (!mcq.length) {
            this.error = `No MCQ questions found for ${this.selectedCategory}. Ask admin to add some.`;
            this.loading = false;
            this.testStarted = false;
            return;
          }

          // shuffle & slice
          this.allMcq = this.shuffleArray(mcq);
          this.testQuestions = this.allMcq.slice(0, this.questionCount);
          this.userAnswers = new Array(this.testQuestions.length).fill(null);

          this.testStarted = true;
          this.loading = false;
        },
        error: (err: any) => {
          console.error(err);
          this.error = 'Failed to load questions';
          this.loading = false;
        }
      });
  }

  private shuffleArray<T>(arr: T[]): T[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  selectAnswer(qIndex: number, optIndex: number): void {
    this.userAnswers[qIndex] = optIndex;
  }

  submitTest(): void {
    if (!this.testQuestions.length) return;

    let correct = 0;
    this.testQuestions.forEach((q, i) => {
      if (q.correctOptionIndex === undefined) return;
      if (this.userAnswers[i] === q.correctOptionIndex) {
        correct++;
      }
    });

    this.score = correct;
    this.testSubmitted = true;
  }

  resetTest(): void {
    this.testStarted = false;
    this.testSubmitted = false;
    this.score = 0;
    this.testQuestions = [];
    this.userAnswers = [];
  }

  getOptionLabel(index: number): string {
    return String.fromCharCode(65 + index);
  }
}

