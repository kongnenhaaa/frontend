import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_BASE_URL } from '../api.config';

export interface Department {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class DepartmentsApi {
  constructor(private readonly http: HttpClient) {}

  list() {
    return this.http.get<{ items: Department[] }>(`${API_BASE_URL}/departments`);
  }

  create(payload: Partial<Department>) {
    return this.http.post<Department>(`${API_BASE_URL}/departments`, payload);
  }

  update(id: string, payload: Partial<Department>) {
    return this.http.patch<Department>(`${API_BASE_URL}/departments/${id}`, payload);
  }

  remove(id: string) {
    return this.http.delete(`${API_BASE_URL}/departments/${id}`);
  }
}
