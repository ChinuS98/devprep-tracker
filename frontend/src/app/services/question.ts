import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Question } from '../models/question.model';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private apiUrl = `${environment.apiBaseUrl}/questions`;

  constructor(private http: HttpClient) {}

  getQuestions(filters?: {
    topic?: string;
    status?: string;
    search?: string;
    category?: string;
  }): Observable<Question[]> {

    let params = new HttpParams();
    if (filters?.topic) params = params.set('topic', filters.topic);
    if (filters?.status) params = params.set('status', filters.status);
    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.category) params = params.set('category', filters.category);

    return this.http.get<Question[]>(this.apiUrl, { params });
  }

  createQuestion(q: Question): Observable<Question> {
    return this.http.post<Question>(this.apiUrl, q);
  }

  updateQuestion(id: string, q: Partial<Question>): Observable<Question> {
    return this.http.put<Question>(`${this.apiUrl}/${id}`, q);
  }

  deleteQuestion(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
