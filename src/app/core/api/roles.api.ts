import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_BASE_URL } from '../api.config';

export interface Role {
  id: string;
  name: string;
  description?: string | null;
  permissions?: { code: string }[];
}

@Injectable({ providedIn: 'root' })
export class RolesApi {
  constructor(private readonly http: HttpClient) {}

  list() {
    return this.http.get<{ items: Role[] }>(`${API_BASE_URL}/roles`);
  }

  create(payload: Partial<Role>) {
    return this.http.post<Role>(`${API_BASE_URL}/roles`, payload);
  }

  update(id: string, payload: Partial<Role>) {
    return this.http.patch<Role>(`${API_BASE_URL}/roles/${id}`, payload);
  }

  remove(id: string) {
    return this.http.delete(`${API_BASE_URL}/roles/${id}`);
  }
}
