import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DepartmentsApi, Department } from '../../core/api/departments.api';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.css',
})
export class DepartmentsComponent implements OnInit {
  readonly departments = signal<Department[]>([]);

  constructor(private readonly departmentsApi: DepartmentsApi) {}

  ngOnInit() {
    this.departmentsApi.list().subscribe((response) => this.departments.set(response.items));
  }
}
