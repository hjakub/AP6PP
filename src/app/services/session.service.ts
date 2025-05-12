import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private balanceSubject = new BehaviorSubject<number>(0);
  balance$ = this.balanceSubject.asObservable();

  setBalance(balance: number) {
    console.log('SessionService: setBalance called with', balance);
    this.balanceSubject.next(balance);
  }

  getBalance(): number {
    return this.balanceSubject.value;
  }
}