import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { API_BASE_URL } from '../api.config';
import { DemoStore } from '../demo/demo.store';

export interface AttendanceReport {
  total: number;
  breakdown: { status: string; count: number }[];
  generatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class ReportsApi {
  constructor(private readonly http: HttpClient) {}

  attendanceReport() {
    if (DemoStore.isDemo()) {
      const data = DemoStore.getData();
      const counts = data.attendance.reduce((acc, rec) => {
        acc[rec.status] = (acc[rec.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const breakdown = Object.entries(counts).map(([status, count]) => ({ status, count }));
      const report: AttendanceReport = {
        total: data.attendance.length,
        breakdown,
        generatedAt: new Date().toISOString(),
      };
      return of(report);
    }

    return this.http.get<AttendanceReport>(`${API_BASE_URL}/reports/attendance`);
  }
}
