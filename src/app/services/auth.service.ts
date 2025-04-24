/* Old dummy auth service
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private mockUser = { email: 'test@test.com', password: 'test' };
  private isAuthenticated = false;

  login(email: string, password: string): boolean {
    if (email === this.mockUser.email && password === this.mockUser.password) {
      this.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(this.mockUser));
      return true;
    }
    return false;
  }

  logout() {
    this.isAuthenticated = false;
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated || localStorage.getItem('user') !== null;
  }
} */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { RegisterPayload } from './interfaces/registerPayload';
import { LoginPayload } from './interfaces/loginPayload';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = '/api/auth';
  private _isLoggedIn$ = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  registerUser(payload: RegisterPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, payload);
  }

  loginUser(payload: LoginPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, payload);
  }

  verifyEmail(token: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/verify-email?token=${token}`);
  }

  logout() {
    localStorage.removeItem('token');
    this._isLoggedIn$.next(false);
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
    this._isLoggedIn$.next(true);
  }

  get isLoggedIn() {
    return this._isLoggedIn$.asObservable();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }
}