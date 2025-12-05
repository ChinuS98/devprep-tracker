import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenKey = 'adminToken';
  private usernameKey = 'adminUsername';
  private roleKey = 'adminRole';

  // Login + Remember Me
  login(token: string, username: string, role: string, rememberMe: boolean): void {
    const storage = rememberMe ? localStorage : sessionStorage;
    const otherStorage = rememberMe ? sessionStorage : localStorage;

    storage.setItem(this.tokenKey, token);
    storage.setItem(this.usernameKey, username);
    storage.setItem(this.roleKey, role);

    // Remove from other storage
    otherStorage.removeItem(this.tokenKey);
    otherStorage.removeItem(this.usernameKey);
    otherStorage.removeItem(this.roleKey);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usernameKey);
    localStorage.removeItem(this.roleKey);

    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem(this.usernameKey);
    sessionStorage.removeItem(this.roleKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey) ||
           sessionStorage.getItem(this.tokenKey);
  }

  getUsername(): string | null {
    return localStorage.getItem(this.usernameKey) ||
           sessionStorage.getItem(this.usernameKey);
  }

  getRole(): string | null {
    return localStorage.getItem(this.roleKey) ||
           sessionStorage.getItem(this.roleKey);
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }
}
