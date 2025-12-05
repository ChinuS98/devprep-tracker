import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Question } from '../../models/question.model';
import { QuestionService } from '../../services/question';
import { QuestionFormComponent } from '../question-form/question-form';

@Component({
  selector: 'app-question-list',
  standalone: true,
  imports: [CommonModule, FormsModule, QuestionFormComponent],
  templateUrl: './question-list.html',
  styleUrl: './question-list.scss'
})
export class QuestionListComponent implements OnInit {
  questions: Question[] = [];
  loading = false;
  error = '';

  selectedQuestion: Question | null = null;

  filterTopic = '';
  filterStatus = '';
  filterCategory = '';
  searchText = '';

  constructor(private questionService: QuestionService) {}

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions() {
    this.loading = true;
    this.questionService
      .getQuestions({
        topic: this.filterTopic || undefined,
        status: this.filterStatus || undefined,
        search: this.searchText || undefined,
        category: this.filterCategory || undefined
      })
      .subscribe({
        next: data => {
          this.questions = data;
          this.loading = false;
        },
        error: err => {
          console.error(err);
          this.error = 'Failed to load questions';
          this.loading = false;
        }
      });
  }

  applyFilters() {
    this.loadQuestions();
  }

  onCreate(q: Question) {
    this.questionService.createQuestion(q).subscribe({
      next: () => this.loadQuestions()
    });
  }

  onUpdate(q: Question) {
    if (!q._id) return;
    this.questionService.updateQuestion(q._id, q).subscribe({
      next: () => {
        this.selectedQuestion = null;
        this.loadQuestions();
      }
    });
  }

  editQuestion(q: Question) {
    this.selectedQuestion = q;
  }

  clearEdit() {
    this.selectedQuestion = null;
  }

  deleteQuestion(id?: string) {
    if (!id) return;
    if (!confirm('Delete this question?')) return;
    this.questionService.deleteQuestion(id).subscribe({
      next: () => this.loadQuestions()
    });
  }

  formatTags(q: Question): string {
    if (!q.tags || q.tags.length === 0) return '';
    return q.tags.join(', ');
  }
}
