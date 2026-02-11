import { inject, Injectable } from '@angular/core';
import { TokenManager } from '../utils/manager/token-manager';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  isAuthenticated(): boolean {
    return !!TokenManager.prototype.getToken();
  }

  login(username: string, password: string) {
    return this.http.get<any[]>('/datasource/users/users.json');
  }

  me() {
    return this.http.get<any>('/datasource/users/users.json');
  }
}
