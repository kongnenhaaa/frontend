import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_BASE_URL } from '../api.config';

export interface Setting {
  id: string;
  key: string;
  value: string;
}

@Injectable({ providedIn: 'root' })
export class SettingsApi {
  constructor(private readonly http: HttpClient) {}

  list() {
    return this.http.get<{ items: Setting[] }>(`${API_BASE_URL}/settings`);
  }

  upsert(key: string, value: string) {
    return this.http.post<Setting>(`${API_BASE_URL}/settings`, { key, value });
  }
}
