import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  username = '';
  password = '';
  rememberMe = true;
  error = '';

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private router: Router
  ) {}

  login(): void {
    this.error = '';

    this.http.post<any>('http://localhost:5000/api/admin/login', {
      username: this.username,
      password: this.password
    }).subscribe({
      next: (res) => {
        if (res.success && res.token) {
          const role = res.role || 'admin';
          const name = res.username || this.username;
          this.auth.login(res.token, name, role, this.rememberMe);
          this.router.navigate(['/questions']);
        } else {
          this.error = 'Invalid response from server';
        }
      },
      error: () => {
        this.error = 'Invalid username or password';
      }
    });
  }
}
