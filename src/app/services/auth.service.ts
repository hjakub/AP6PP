import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { RegisterPayload } from './interfaces/registerPayload';
import { LoginPayload } from './interfaces/loginPayload';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = '/api/auth';
  private _isLoggedIn$ = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient) {}

  registerUser(payload: RegisterPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, payload);
  }

  loginUser(payload: LoginPayload): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, payload).pipe(
      tap((response: any) => {
        if (response?.success) {
          this.setToken(response.data);
        }
      })
    );
  }

  verifyEmail(token: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/verify-email?token=${token}`);
  }

  logout() {
    localStorage.removeItem('token');
    this._isLoggedIn$.next(false);
    console.log('Token after logout:', localStorage.getItem('token'));
  }

  setSession(token: string, userId: number): void {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId.toString());
    this._isLoggedIn$.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this._isLoggedIn$.next(false);
  }

  getUserId(): number | null {
    const id = localStorage.getItem('userId');
    return id ? parseInt(id, 10) : null;
  }

  getUserIdFromToken(token: string): number | null {
    try {
      const decoded: any = jwtDecode(token);
      console.log('Decoded token:', decoded);
      const userId = decoded.userid;
      return parseInt(userId);
    } catch (err) {
      console.error('Decoding error: ', err);
      return null;
    }
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
    this._isLoggedIn$.next(true);
  }

  get isLoggedIn$() {
    return this._isLoggedIn$.asObservable();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  resetPassword(payload: { newPassword: string; userId: string; token: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password`, payload);
  }
}