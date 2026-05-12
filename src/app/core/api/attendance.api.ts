import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { API_BASE_URL } from '../api.config';
import { DemoStore } from '../demo/demo.store';

export interface AttendanceRecord {
  id: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: string;
  employee?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AttendanceApi {
  constructor(private readonly http: HttpClient) {}

  list() {
    if (DemoStore.isDemo()) {
      const data = DemoStore.getData();
      return of({ items: data.attendance });
    }

    return this.http.get<{ items: AttendanceRecord[] }>(`${API_BASE_URL}/attendance`);
  }

  create(payload: Partial<AttendanceRecord> & { employeeId: string }) {
    if (DemoStore.isDemo()) {
      const data = DemoStore.getData();
      const employee = data.employees.find((emp) => emp.id === payload.employeeId);
      const record: AttendanceRecord = {
        id: DemoStore.newId(),
        date: payload.date || new Date().toISOString().slice(0, 10),
        checkIn: payload.checkIn,
        checkOut: payload.checkOut,
        status: payload.status || 'present',
        employee: employee
          ? {
              id: employee.id,
              firstName: employee.firstName,
              lastName: employee.lastName,
              email: employee.email,
            }
          : undefined,
      };
      data.attendance = [...data.attendance, record];
      DemoStore.setData(data);
      return of(record);
    }

    return this.http.post<AttendanceRecord>(`${API_BASE_URL}/attendance`, payload);
  }

  update(id: string, payload: Partial<AttendanceRecord>) {
    if (DemoStore.isDemo()) {
      const data = DemoStore.getData();
      data.attendance = data.attendance.map((record) =>
        record.id === id ? { ...record, ...payload } : record
      );
      DemoStore.setData(data);
      const updated = data.attendance.find((record) => record.id === id)!;
      return of(updated);
    }

    return this.http.patch<AttendanceRecord>(`${API_BASE_URL}/attendance/${id}`, payload);
  }

  remove(id: string) {
    if (DemoStore.isDemo()) {
      const data = DemoStore.getData();
      data.attendance = data.attendance.filter((record) => record.id !== id);
      DemoStore.setData(data);
      return of(void 0);
    }

    return this.http.delete<void>(`${API_BASE_URL}/attendance/${id}`);
  }
}
