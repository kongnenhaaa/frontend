import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_BASE_URL } from '../api.config';

export interface DashboardSummary {
  employees: number;
  departments: number;
  attendance: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardApi {
  constructor(private readonly http: HttpClient) {}

  summary() {
    return this.http.get<DashboardSummary>(`${API_BASE_URL}/dashboard/summary`);
  }
}
