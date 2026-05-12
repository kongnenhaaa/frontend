import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { DashboardApi, DashboardSummary } from '../../core/api/dashboard.api';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  readonly summary = signal<DashboardSummary | null>(null);

  statusChartData = signal<ChartData<'pie'> | null>(null);
  deptChartData = signal<ChartData<'bar'> | null>(null);

  today = new Date().toLocaleDateString('en-US', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
  });

  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: { family: 'Inter', size: 12 },
          color: '#475569',
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 8,
        },
      },
    },
  };

  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#f1f5f9' },
        ticks: {
          font: { family: 'Inter', size: 11 },
          color: '#94a3b8',
          stepSize: 1,
        },
      },
      x: {
        grid: { display: false },
        ticks: {
          font: { family: 'Inter', size: 11 },
          color: '#94a3b8',
        },
      },
    },
  };

  constructor(private readonly dashboardApi: DashboardApi) {}

  ngOnInit() {
    this.dashboardApi.summary().subscribe((data) => {
      this.summary.set(data);

      if (data.charts?.status) {
        this.statusChartData.set({
          labels: data.charts.status.map(i => i.name.charAt(0).toUpperCase() + i.name.slice(1)),
          datasets: [{
            data: data.charts.status.map(i => i.value),
            backgroundColor: ['#6366f1', '#22c55e', '#f97316', '#3b82f6', '#eab308'],
            borderColor: '#fff',
            borderWidth: 3,
            hoverOffset: 6,
          }],
        });
      }

      if (data.charts?.departments) {
        this.deptChartData.set({
          labels: data.charts.departments.map(i => i.name),
          datasets: [{
            label: 'Employees',
            data: data.charts.departments.map(i => i.value),
            backgroundColor: ['#6366f1', '#8b5cf6', '#3b82f6', '#22c55e', '#f97316'],
            borderRadius: 8,
            borderSkipped: false,
          }],
        });
      }
    });
  }
}
