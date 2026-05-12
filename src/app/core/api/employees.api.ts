import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_BASE_URL } from '../api.config';

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

@Injectable({ providedIn: 'root' })
export class EmployeesApi {
  constructor(private readonly http: HttpClient) {}

  list(query: { q?: string; page?: number; limit?: number; status?: string } = {}) {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<EmployeeListResponse>(`${API_BASE_URL}/employees`, { params });
  }

  create(payload: Partial<Employee>) {
    return this.http.post<Employee>(`${API_BASE_URL}/employees`, payload);
  }

  update(id: string, payload: Partial<Employee>) {
    return this.http.patch<Employee>(`${API_BASE_URL}/employees/${id}`, payload);
  }

  remove(id: string) {
    return this.http.delete(`${API_BASE_URL}/employees/${id}`);
  }
}
