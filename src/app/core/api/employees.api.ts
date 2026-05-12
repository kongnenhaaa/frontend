import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { API_BASE_URL } from '../api.config';
import { DemoStore } from '../demo/demo.store';

export interface Employee {
  id: string;
  code: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  title?: string | null;
  status: string;
  hiredAt?: string | null;
  department?: { id: string, name: string } | null;
}

export interface EmployeeListResponse {
  items: Employee[];
  meta: { page: number; limit: number; total: number };
}

export type EmployeeCreatePayload = Partial<Employee> & { departmentId?: string };

@Injectable({ providedIn: 'root' })
export class EmployeesApi {
  constructor(private readonly http: HttpClient) {}

  list(query: { q?: string; page?: number; limit?: number; status?: string } = {}) {
    if (DemoStore.isDemo()) {
      const data = DemoStore.getData();
      const q = (query.q || '').toLowerCase();
      const status = query.status || '';
      let items = data.employees.filter((emp) => {
        const matchStatus = !status || emp.status === status;
        const matchQuery = !q ||
          `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(q) ||
          (emp.email || '').toLowerCase().includes(q) ||
          (emp.code || '').toLowerCase().includes(q);
        return matchStatus && matchQuery;
      });

      const total = items.length;
      const page = query.page ?? 1;
      const limit = query.limit ?? total;
      const start = (page - 1) * limit;
      items = items.slice(start, start + limit);
      return of({ items, meta: { page, limit, total } });
    }

    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<EmployeeListResponse>(`${API_BASE_URL}/employees`, { params });
  }

  create(payload: EmployeeCreatePayload) {
    if (DemoStore.isDemo()) {
      const data = DemoStore.getData();
      const dept = payload.departmentId
        ? data.departments.find((d) => d.id === payload.departmentId)
        : undefined;
      const employee: Employee = {
        id: DemoStore.newId(),
        code: payload.code || `EMP-${data.employees.length + 1}`,
        firstName: payload.firstName || 'Demo',
        lastName: payload.lastName || 'User',
        email: payload.email || `demo${data.employees.length + 1}@corehr.com`,
        phone: payload.phone ?? null,
        title: payload.title ?? null,
        status: payload.status || 'active',
        hiredAt: payload.hiredAt ?? null,
        department: dept ? { id: dept.id, name: dept.name } : null,
      };
      data.employees = [...data.employees, employee];
      DemoStore.setData(data);
      return of(employee);
    }

    return this.http.post<Employee>(`${API_BASE_URL}/employees`, payload);
  }

  update(id: string, payload: Partial<Employee>) {
    if (DemoStore.isDemo()) {
      const data = DemoStore.getData();
      data.employees = data.employees.map((emp) =>
        emp.id === id ? { ...emp, ...payload } : emp
      );
      DemoStore.setData(data);
      const updated = data.employees.find((emp) => emp.id === id)!;
      return of(updated);
    }

    return this.http.patch<Employee>(`${API_BASE_URL}/employees/${id}`, payload);
  }

  remove(id: string) {
    if (DemoStore.isDemo()) {
      const data = DemoStore.getData();
      data.employees = data.employees.filter((emp) => emp.id !== id);
      data.attendance = data.attendance.filter((att) => att.employee?.id !== id);
      DemoStore.setData(data);
      return of(void 0);
    }

    return this.http.delete<void>(`${API_BASE_URL}/employees/${id}`);
  }
}
