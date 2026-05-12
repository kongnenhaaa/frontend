import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { API_BASE_URL } from '../api.config';
import { DemoStore } from '../demo/demo.store';

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
    if (DemoStore.isDemo()) {
      const data = DemoStore.getData();
      return of({ items: data.roles });
    }

    return this.http.get<{ items: Role[] }>(`${API_BASE_URL}/roles`);
  }

  create(payload: Partial<Role>) {
    if (DemoStore.isDemo()) {
      const data = DemoStore.getData();
      const perms = (payload.permissions || []).map((perm) =>
        typeof perm === 'string' ? { code: perm } : perm
      );
      const role: Role = {
        id: DemoStore.newId(),
        name: payload.name || 'New Role',
        description: payload.description ?? null,
        permissions: perms,
      };
      data.roles = [...data.roles, role];
      DemoStore.setData(data);
      return of(role);
    }

    return this.http.post<Role>(`${API_BASE_URL}/roles`, payload);
  }

  update(id: string, payload: Partial<Role>) {
    if (DemoStore.isDemo()) {
      const data = DemoStore.getData();
      data.roles = data.roles.map((role) =>
        role.id === id ? { ...role, ...payload } : role
      );
      DemoStore.setData(data);
      const updated = data.roles.find((role) => role.id === id)!;
      return of(updated);
    }

    return this.http.patch<Role>(`${API_BASE_URL}/roles/${id}`, payload);
  }

  remove(id: string) {
    if (DemoStore.isDemo()) {
      const data = DemoStore.getData();
      data.roles = data.roles.filter((role) => role.id !== id);
      DemoStore.setData(data);
      return of(void 0);
    }

    return this.http.delete<void>(`${API_BASE_URL}/roles/${id}`);
  }
}
