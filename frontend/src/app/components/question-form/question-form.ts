import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Question } from '../../models/question.model';

@Component({
  selector: 'app-question-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './question-form.html',
  styleUrl: './question-form.scss'
})
export class QuestionFormComponent implements OnChanges {
  @Input() initialData: Question | null = null;
  @Output() saved = new EventEmitter<Question>();

  // separate string for tags input (to avoid template casting)
  tagsInput = '';

  form: Question = {
    topic: '',
    questionText: '',
    type: 'subjective',
    answer: '',
    options: ['', '', '', ''],
    correctOptionIndex: 0,
    difficulty: 'Easy',
    status: 'To Learn',
    category: 'JavaScript',
    tags: [],
    resourceLink: '',
    sourceType: '',
    uiPattern: '',
    figmaUrl: ''
  };

  ngOnChanges(): void {
    if (this.initialData) {
      this.form = {
        ...this.initialData,
        options: this.initialData.options?.length
          ? [...this.initialData.options]
          : ['', '', '', ''],
        tags: this.initialData.tags ?? []
      };

      // Prepare tagsInput string for editing
      this.tagsInput = this.form.tags && this.form.tags.length
        ? this.form.tags.join(', ')
        : '';
    }
  }

  private buildTagsArray(): string[] {
    if (!this.tagsInput) return [];
    return this.tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);
  }

  onSubmit() {
    this.form.tags = this.buildTagsArray();

    // Ensure options is always an array of 4 strings
    if (!this.form.options || this.form.options.length === 0) {
      this.form.options = ['', '', '', ''];
    }

    this.saved.emit(this.form);

    if (!this.initialData) {
      this.resetForm();
    }
  }

  private resetForm() {
    this.form = {
      topic: '',
      questionText: '',
      type: 'subjective',
      answer: '',
      options: ['', '', '', ''],
      correctOptionIndex: 0,
      difficulty: 'Easy',
      status: 'To Learn',
      category: 'JavaScript',
      tags: [],
      resourceLink: '',
      sourceType: '',
      uiPattern: '',
      figmaUrl: ''
    };
    this.tagsInput = '';
  }
}
