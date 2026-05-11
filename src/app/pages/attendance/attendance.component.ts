import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AttendanceApi, AttendanceRecord } from '../../core/api/attendance.api';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css',
})
export class AttendanceComponent implements OnInit {
  readonly records = signal<AttendanceRecord[]>([]);

  constructor(private readonly attendanceApi: AttendanceApi) {}

  ngOnInit() {
    this.attendanceApi.list().subscribe((response) => this.records.set(response.items));
  }
}
