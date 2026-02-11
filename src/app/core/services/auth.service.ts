import { inject, Injectable, signal } from '@angular/core';
import { TokenManager } from '../utils/manager/token-manager';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs';
import { IUser } from '@core/interfaces';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  _user: IUser | null = null;

  get user() {
    return this._user;
  }

  isAuthenticated(): boolean {
    return !!TokenManager.prototype.getToken();
  }

  login(username: string, password: string) {
    return this.http
      .get<{ users: IUser[] }>('/datasource/users/users.json')
      .pipe(
        map((res) =>
          res.users.find(
            (u: IUser) => u.username.toLocaleLowerCase() === username.toLocaleLowerCase(),
          ),
        ),
      );
  }

  me() {
    return this.http.get<{ users: IUser[] }>('/datasource/users/users.json').pipe(
      tap((res) => {
        const token = TokenManager.prototype.getToken();
        if (!token) return null;

        const userId = Number(token);
        this._user = res.users.find((u: IUser) => u.id === userId) || null;

        return this._user;
      }),
    );
  }

  logout() {
    TokenManager.prototype.removeToken();
    this._user = null;
  }
}
