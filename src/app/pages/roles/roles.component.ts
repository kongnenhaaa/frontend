import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RolesApi, Role } from '../../core/api/roles.api';
import { RoleDialogComponent } from './role-dialog/role-dialog.component';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatDialogModule, MatIconModule, MatMenuModule],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css',
})
export class RolesComponent implements OnInit {
  readonly roles = signal<Role[]>([]);
  readonly searchControl = new FormControl('');
  readonly searchTerm = signal<string>('');

  readonly filteredRoles = computed(() => {
    const q = this.searchTerm().toLowerCase();
    return !q ? this.roles() : this.roles().filter(r =>
      r.name.toLowerCase().includes(q) || (r.description || '').toLowerCase().includes(q)
    );
  });

  constructor(private readonly rolesApi: RolesApi, private readonly dialog: MatDialog) {}

  ngOnInit() {
    this.loadRoles();
    this.searchControl.valueChanges.subscribe(v => this.searchTerm.set(v || ''));
  }

  loadRoles() {
    this.rolesApi.list().subscribe(res => this.roles.set(res.items));
  }

  openDialog(role?: Role) {
    const dialogRef = this.dialog.open(RoleDialogComponent, {
      width: '580px', data: role || null, panelClass: 'premium-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (role) {
          this.rolesApi.update(role.id, result).subscribe(() => this.loadRoles());
        } else {
          this.rolesApi.create(result).subscribe(() => this.loadRoles());
        }
      }
    });
  }

  deleteRole(id: string) {
    if (confirm('Are you sure you want to delete this role?')) {
      this.rolesApi.remove(id).subscribe(() => this.loadRoles());
    }
  }
}
