import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RolesApi, Role } from '../../core/api/roles.api';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css',
})
export class RolesComponent implements OnInit {
  readonly roles = signal<Role[]>([]);

  constructor(private readonly rolesApi: RolesApi) {}

  ngOnInit() {
    this.rolesApi.list().subscribe((response) => this.roles.set(response.items));
  }
}
