import { Component, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ReportsApi, AttendanceReport } from '../../core/api/reports.api';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
})
export class ReportsComponent implements OnInit {
  readonly attendanceReport = signal<AttendanceReport | null>(null);

  constructor(private readonly reportsApi: ReportsApi) {}

  ngOnInit() {
    this.reportsApi.attendanceReport().subscribe((report) => this.attendanceReport.set(report));
  }
}
