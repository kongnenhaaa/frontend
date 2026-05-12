import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { API_BASE_URL } from '../api.config';
import { DemoStore } from '../demo/demo.store';

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
    if (DemoStore.isDemo()) {
      const data = DemoStore.getData();
      return of({ items: data.departments });
    }

    return this.http.get<{ items: Department[] }>(`${API_BASE_URL}/departments`);
  }

  create(payload: Partial<Department>) {
    if (DemoStore.isDemo()) {
      const data = DemoStore.getData();
      const dept: Department = {
        id: DemoStore.newId(),
        name: payload.name || 'New Department',
        description: payload.description ?? null,
        isActive: payload.isActive ?? true,
      };
      data.departments = [...data.departments, dept];
      DemoStore.setData(data);
      return of(dept);
    }

    return this.http.post<Department>(`${API_BASE_URL}/departments`, payload);
  }

  update(id: string, payload: Partial<Department>) {
    if (DemoStore.isDemo()) {
      const data = DemoStore.getData();
      data.departments = data.departments.map((dept) =>
        dept.id === id ? { ...dept, ...payload } : dept
      );
      DemoStore.setData(data);
      const updated = data.departments.find((dept) => dept.id === id)!;
      return of(updated);
    }

    return this.http.patch<Department>(`${API_BASE_URL}/departments/${id}`, payload);
  }

  remove(id: string) {
    if (DemoStore.isDemo()) {
      const data = DemoStore.getData();
      data.departments = data.departments.filter((dept) => dept.id !== id);
      DemoStore.setData(data);
      return of(void 0);
    }

    return this.http.delete<void>(`${API_BASE_URL}/departments/${id}`);
  }
}
