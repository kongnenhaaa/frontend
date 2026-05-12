import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_BASE_URL } from '../api.config';

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
    return this.http.get<{ items: AttendanceRecord[] }>(`${API_BASE_URL}/attendance`);
  }

  create(payload: Partial<AttendanceRecord> & { employeeId: string }) {
    return this.http.post<AttendanceRecord>(`${API_BASE_URL}/attendance`, payload);
  }

  update(id: string, payload: Partial<AttendanceRecord>) {
    return this.http.patch<AttendanceRecord>(`${API_BASE_URL}/attendance/${id}`, payload);
  }

  remove(id: string) {
    return this.http.delete(`${API_BASE_URL}/attendance/${id}`);
  }
}
