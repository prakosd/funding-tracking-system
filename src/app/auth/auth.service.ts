import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userId: string;
  constructor() {
    this.userId = 'prakosd';
  }

  getUserId() {
    return this.userId;
  }
}
