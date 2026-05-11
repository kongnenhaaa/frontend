import { Component, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { DashboardApi, DashboardSummary } from '../../core/api/dashboard.api';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  readonly summary = signal<DashboardSummary | null>(null);

  constructor(private readonly dashboardApi: DashboardApi) {}

  ngOnInit() {
    this.dashboardApi.summary().subscribe((data) => this.summary.set(data));
  }
}
