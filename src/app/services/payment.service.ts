import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private baseUrl = 'http://localhost:5121/api';

  constructor(private http: HttpClient) {}

  createPayment(paymentData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/createpayment`, paymentData);
  }

  getPayment(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/getpayment/${id}`);
  }

  updatePayment(paymentData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/updatepayment`, paymentData);
  }

  getBalance(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/getbalance/${userId}`);
  }

  createBalance(balanceData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/createbalance`, balanceData);
  }
}