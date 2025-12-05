import { Routes } from '@angular/router';
import { QuestionListComponent } from './components/question-list/question-list';
import { StudyPageComponent } from './components/study-page/study-page';
import { TestPageComponent } from './components/test-page/test-page';
import { LoginComponent } from './components/login/login';
import { authGuard } from './auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'study', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },

  // Admin-only
  { path: 'questions', component: QuestionListComponent, canActivate: [authGuard] },

  // Public
  { path: 'study', component: StudyPageComponent },
  { path: 'test', component: TestPageComponent }
];
