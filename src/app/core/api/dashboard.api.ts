import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { API_BASE_URL } from '../api.config';
import { DemoStore } from '../demo/demo.store';

export interface DashboardSummary {
  employees: number;
  departments: number;
  attendance: number;
  charts: {
    status: { name: string; value: number }[];
    departments: { name: string; value: number }[];
  };
}

@Injectable({ providedIn: 'root' })
export class DashboardApi {
  constructor(private readonly http: HttpClient) {}

  summary() {
    if (DemoStore.isDemo()) {
      const data = DemoStore.getData();
      
      const statusCounts = data.employees.reduce((acc, emp) => {
        acc[emp.status] = (acc[emp.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const deptCounts = data.employees.reduce((acc, emp) => {
        if (emp.department) {
          acc[emp.department.name] = (acc[emp.department.name] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      const summary: DashboardSummary = {
        employees: data.employees.length,
        departments: data.departments.length,
        attendance: data.attendance.filter(a => a.status === 'present' || a.status === 'late').length,
        charts: {
          status: Object.entries(statusCounts).map(([name, value]) => ({ name, value })),
          departments: Object.entries(deptCounts).map(([name, value]) => ({ name, value })),
        }
      };
      return of(summary);
    }
    return this.http.get<DashboardSummary>(`${API_BASE_URL}/dashboard/summary`);
  }
}
