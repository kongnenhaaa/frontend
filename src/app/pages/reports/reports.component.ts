import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, TitleCasePipe, DatePipe, DecimalPipe } from '@angular/common';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ReportsApi, AttendanceReport } from '../../core/api/reports.api';
import { ChartConfiguration, ChartData } from 'chart.js';

const STATUS_STYLES: Record<string, string> = {
  present:  '--accent:#22c55e;--acc-rgb:34,197,94',
  absent:   '--accent:#ef4444;--acc-rgb:239,68,68',
  late:     '--accent:#f97316;--acc-rgb:249,115,22',
  half_day: '--accent:#3b82f6;--acc-rgb:59,130,246',
};

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, TitleCasePipe, DatePipe, DecimalPipe],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
})
export class ReportsComponent implements OnInit {
  readonly attendanceReport = signal<AttendanceReport | null>(null);
  attendanceChartData = signal<ChartData<'doughnut'> | null>(null);

  pieChartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'right',
        labels: { font: { family: 'Inter', size: 12 }, color: '#475569', padding: 14, usePointStyle: true },
      },
    },
  };

  constructor(private readonly reportsApi: ReportsApi) {}

  ngOnInit() {
    this.reportsApi.attendanceReport().subscribe(report => {
      this.attendanceReport.set(report);
      if (report.breakdown) {
        this.attendanceChartData.set({
          labels: report.breakdown.map(b => b.status === 'half_day' ? 'Half Day' : b.status.charAt(0).toUpperCase() + b.status.slice(1)),
            datasets: [{
              data: report.breakdown.map(b => b.count),
              backgroundColor: ['#22c55e','#ef4444','#f97316','#3b82f6','#eab308'],
              borderWidth: 3,
              borderColor: '#fff',
              hoverOffset: 6,
            }],
        });
      }
    });
  }

  getKpiStyle(status: string): string {
    return STATUS_STYLES[status] || '--accent:#6366f1;--acc-rgb:99,102,241';
  }

  getPercent(count: number): number {
    const total = this.attendanceReport()?.total || 1;
    return (count / total) * 100;
  }
}
