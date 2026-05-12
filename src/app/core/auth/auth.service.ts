import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_BASE_URL } from '../api.config';
import { DemoStore } from '../demo/demo.store';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    roles: string[];
    permissions: string[];
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly accessTokenKey = 'corehr_access_token';
  private readonly refreshTokenKey = 'corehr_refresh_token';
  private readonly userKey = 'corehr_user';

  readonly user = signal<AuthResponse['user'] | null>(this.readUser());

  constructor(private readonly http: HttpClient) {}

  login(email: string, password: string) {
    if (DemoStore.isDemo()) {
      return this.loginDemo();
    }

    return this.http
      .post<AuthResponse>(`${API_BASE_URL}/auth/login`, { email, password })
      .pipe(tap((response) => this.storeAuth(response)));
  }

  loginDemo() {
    const response: AuthResponse = {
      accessToken: 'demo-access-token',
      refreshToken: 'demo-refresh-token',
      user: {
        id: 'demo-user',
        email: 'admin@corehr.com',
        roles: ['demo-admin'],
        permissions: ['employees:read', 'departments:read', 'attendance:read', 'settings:read'],
      },
    };

    this.storeAuth(response);
    return of(response);
  }

  refresh() {
    const refreshToken = this.getRefreshToken();
    return this.http
      .post<AuthResponse>(`${API_BASE_URL}/auth/refresh`, { refreshToken })
      .pipe(tap((response) => this.storeAuth(response)));
  }

  logout() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.clearAuth();
      return null;
    }

    return this.http
      .post(`${API_BASE_URL}/auth/logout`, { refreshToken })
      .pipe(tap(() => this.clearAuth()));
  }

  isAuthenticated() {
    return Boolean(this.getAccessToken());
  }

  getAccessToken() {
    return localStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken() {
    return localStorage.getItem(this.refreshTokenKey);
  }

  private storeAuth(response: AuthResponse) {
    localStorage.setItem(this.accessTokenKey, response.accessToken);
    localStorage.setItem(this.refreshTokenKey, response.refreshToken);
    localStorage.setItem(this.userKey, JSON.stringify(response.user));
    this.user.set(response.user);
  }

  private clearAuth() {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userKey);
    this.user.set(null);
  }

  private readUser() {
    const raw = localStorage.getItem(this.userKey);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthResponse['user'];
    } catch (error) {
      return null;
    }
  }
}
