import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { map, catchError } from 'rxjs/operators';

interface JwtPayload {
  nameid: string;
  name: string;
}

interface UpdateUserRequest {
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  weight?: number;
  height?: number;
  sex?: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private userBaseUrl = 'http://localhost:5189/api/user';
  private authBaseUrl = 'http://localhost:8005/api/auth';

  constructor(private http: HttpClient) {}

  getUserIdFromToken(): number | null {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('Token not found.');
      return null;
    }
  
    try {
      const decoded: any = jwtDecode(token);
      const userId = decoded.userid;
      return parseInt(userId);
    } catch (err) {
      console.error('Decoding error: ', err);
      return null;
    }
  }

  getStoredUserId(): number | null {
    const rawId = localStorage.getItem('userId');
    return rawId ? parseInt(rawId, 10) : null;
  }

  getCurrentUser(): Observable<any> {
    const id = this.getStoredUserId();
    if (!id) {
      console.warn('No userId.');
      return of(null);
    }
    return this.getUserById(id);
  }

  getUserById(id: number): Observable<any> {
    return this.http.get<any>(`${this.userBaseUrl}/${id}`).pipe(
      map(response => response?.data?.user || null),
      catchError(err => {
        console.error('Error:', err);
        return of(null);
      })
    );
  }

  updateUser(userId: number, updatedData: any): Observable<any> {
    return this.http.put(`${this.userBaseUrl}/${userId}`, updatedData);
  }

  resetPassword(userId: number, newPassword: string): Observable<any> {
    return this.http.post(`${this.authBaseUrl}/reset-password`, {
      userId,
      newPassword
    });
  }

  changePassword(newPassword: string, repeatPassword: string): Observable<any> {
    //const token = localStorage.getItem('token');
    return this.http.post(`${this.authBaseUrl}/change-password`, {
      newPassword,
      repeatPassword
    });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.userBaseUrl}/${id}`);
  }
}