import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { EmployeesApi, Employee } from '../../core/api/employees.api';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css',
})
export class EmployeesComponent implements OnInit {
  readonly employees = signal<Employee[]>([]);
  readonly total = signal(0);

  constructor(private readonly employeesApi: EmployeesApi) {}

  ngOnInit() {
    this.employeesApi.list({ page: 1, limit: 20 }).subscribe((response) => {
      this.employees.set(response.items);
      this.total.set(response.meta.total);
    });
  }
}
