import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Payment {
  userId: number;
  roleId: number;
  transactionId: string;
  amount: number;
  transactionType: 'credit' | 'reservation';
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private baseUrl = '/api';
  private getBalanceUrl = `${this.baseUrl}/getbalance`;
  private createPaymentUrl = `${this.baseUrl}/createpayment`;

  constructor(private http: HttpClient) {}

  getBalance(): Observable<any> {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('User ID not found in local storage');
    }
    const url = `${this.getBalanceUrl}/${userId}`;

    return this.http.get<any>(url).pipe(
      map(response => response.data.creditBalance),
      catchError(error => {
        console.error('Error in receiving balance:', error);
        return throwError(() => error);
      })
    );
  }

  createPayment(payment: Payment): Observable<any> {
    return this.http.post<any>(this.createPaymentUrl, payment).pipe(
      catchError(error => {
        console.error('Error in creating payment:', error);
        return throwError(() => error);
      })
    );
  }
}