import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_BASE_URL } from '../api.config';

export interface AttendanceReport {
  total: number;
  generatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class ReportsApi {
  constructor(private readonly http: HttpClient) {}

  attendanceReport() {
    return this.http.get<AttendanceReport>(`${API_BASE_URL}/reports/attendance`);
  }
}
