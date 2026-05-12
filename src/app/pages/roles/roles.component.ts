import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RolesApi, Role } from '../../core/api/roles.api';
import { RoleDialogComponent } from './role-dialog/role-dialog.component';
import { ConfirmDialogComponent } from '../../core/ui/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatDialogModule, MatIconModule, MatMenuModule, MatSnackBarModule],
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

  constructor(
    private readonly rolesApi: RolesApi,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar
  ) {}

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
          this.rolesApi.update(role.id, result).subscribe(() => {
            this.notify('Role updated', 'success');
            this.loadRoles();
          });
        } else {
          this.rolesApi.create(result).subscribe(() => {
            this.notify('Role created', 'success');
            this.loadRoles();
          });
        }
      }
    });
  }

  deleteRole(id: string) {
    this.openDeleteConfirm('Delete role?', 'This action cannot be undone.')
      .subscribe(confirmed => {
        if (!confirmed) return;
        this.rolesApi.remove(id).subscribe(() => {
          this.notify('Role deleted', 'danger');
          this.loadRoles();
        });
      });
  }

  private notify(message: string, tone: 'success' | 'warn' | 'danger') {
    this.snackBar.open(message, 'Close', {
      duration: 2600,
      panelClass: ['app-snack', `snack-${tone}`],
    });
  }

  private openDeleteConfirm(title: string, message: string) {
    return this.dialog.open(ConfirmDialogComponent, {
      data: { title, message, confirmText: 'Delete', cancelText: 'Cancel', tone: 'danger' },
      panelClass: 'confirm-dialog',
    }).afterClosed();
  }
}
