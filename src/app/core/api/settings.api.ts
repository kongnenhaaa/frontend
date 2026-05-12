import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { API_BASE_URL } from '../api.config';
import { DemoStore } from '../demo/demo.store';

export interface Setting {
  id: string;
  key: string;
  value: string;
}

@Injectable({ providedIn: 'root' })
export class SettingsApi {
  constructor(private readonly http: HttpClient) {}

  list() {
    if (DemoStore.isDemo()) {
      const data = DemoStore.getData();
      return of({ items: data.settings });
    }

    return this.http.get<{ items: Setting[] }>(`${API_BASE_URL}/settings`);
  }

  upsert(key: string, value: string) {
    if (DemoStore.isDemo()) {
      const data = DemoStore.getData();
      const existing = data.settings.find((item) => item.key === key);
      if (existing) {
        existing.value = value;
      } else {
        data.settings = [...data.settings, { id: key, key, value }];
      }
      DemoStore.setData(data);
      return of({ id: key, key, value });
    }

    return this.http.post<Setting>(`${API_BASE_URL}/settings`, { key, value });
  }

  remove(key: string) {
    if (DemoStore.isDemo()) {
      const data = DemoStore.getData();
      data.settings = data.settings.filter((item) => item.key !== key);
      DemoStore.setData(data);
      return of(void 0);
    }

    return this.http.delete<void>(`${API_BASE_URL}/settings/${key}`);
  }
}
