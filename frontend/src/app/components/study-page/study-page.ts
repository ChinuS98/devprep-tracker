import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Question } from '../../models/question.model';
import { QuestionService } from '../../services/question';

@Component({
  selector: 'app-study-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './study-page.html',
  styleUrl: './study-page.scss'
})
export class StudyPageComponent implements OnInit {
  questions: Question[] = [];
  filtered: Question[] = [];
  loading = false;
  error = '';

  // filters
  selectedCategory = '';
  selectedDifficulty = '';
  searchText = '';

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

  difficulties = ['Easy', 'Medium', 'Hard'];

  constructor(private questionService: QuestionService) {}

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions(): void {
    this.loading = true;
    this.questionService
      .getQuestions()
      .subscribe({
        next: (data: Question[]) => {
          this.questions = data;
          this.applyFilters();
          this.loading = false;
        },
        error: (err: any) => {
          console.error(err);
          this.error = 'Failed to load questions';
          this.loading = false;
        }
      });
  }

  applyFilters(): void {
    this.filtered = this.questions.filter(q => {
      // Only show for study: both subjective and mcq
      if (this.selectedCategory && q.category !== this.selectedCategory) {
        return false;
      }

      if (this.selectedDifficulty && q.difficulty !== this.selectedDifficulty) {
        return false;
      }

      if (this.searchText) {
        const s = this.searchText.toLowerCase();
        const inQuestion = q.questionText.toLowerCase().includes(s);
        const inAnswer = (q.answer || '').toLowerCase().includes(s);
        const inTopic = q.topic.toLowerCase().includes(s);
        const inTags =
          q.tags && q.tags.some(t => t.toLowerCase().includes(s));
        return inQuestion || inAnswer || inTopic || !!inTags;
      }

      return true;
    });
  }

  clearFilters(): void {
    this.selectedCategory = '';
    this.selectedDifficulty = '';
    this.searchText = '';
    this.applyFilters();
  }
}
