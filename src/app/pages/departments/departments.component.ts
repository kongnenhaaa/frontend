import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DepartmentsApi, Department } from '../../core/api/departments.api';
import { DepartmentDialogComponent } from './department-dialog/department-dialog.component';
import { ConfirmDialogComponent } from '../../core/ui/confirm-dialog/confirm-dialog.component';

const COLORS = ['#6366f1', '#8b5cf6', '#3b82f6', '#22c55e', '#f97316', '#ec4899', '#14b8a6'];

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatDialogModule, MatIconModule, MatMenuModule, MatSnackBarModule],
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.css',
})
export class DepartmentsComponent implements OnInit {
  readonly departments = signal<Department[]>([]);
  readonly searchControl = new FormControl('');
  readonly searchTerm = signal<string>('');
  readonly statusFilter = signal<string>('');

  readonly total = computed(() => this.departments().length);
  readonly activeCount = computed(() => this.departments().filter(d => d.isActive).length);
  readonly inactiveCount = computed(() => this.departments().filter(d => !d.isActive).length);

  readonly filteredDepts = computed(() => {
    const q = this.searchTerm().toLowerCase();
    const s = this.statusFilter();
    return this.departments().filter(d => {
      const matchSearch = !q || d.name.toLowerCase().includes(q) || (d.description || '').toLowerCase().includes(q);
      const matchStatus = !s || (s === 'active' ? d.isActive : !d.isActive);
      return matchSearch && matchStatus;
    });
  });

  constructor(
    private readonly departmentsApi: DepartmentsApi,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar
  ) {}

  getAvatarColor(name: string): string {
    return COLORS[(name.charCodeAt(0) || 0) % COLORS.length];
  }

  ngOnInit() {
    this.loadDepartments();
    this.searchControl.valueChanges.subscribe(v => this.searchTerm.set(v || ''));
  }

  setFilter(s: string) { this.statusFilter.set(s); }

  loadDepartments() {
    this.departmentsApi.list().subscribe(res => this.departments.set(res.items));
  }

  openDialog(department?: Department) {
    const dialogRef = this.dialog.open(DepartmentDialogComponent, {
      width: '520px', data: department || null, panelClass: 'premium-dialog'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (department) {
          this.departmentsApi.update(department.id, result).subscribe(() => {
            this.notify('Department updated', 'success');
            this.loadDepartments();
          });
        } else {
          this.departmentsApi.create(result).subscribe(() => {
            this.notify('Department created', 'success');
            this.loadDepartments();
          });
        }
      }
    });
  }

  deleteDepartment(id: string) {
    this.openDeleteConfirm('Delete department?', 'This action cannot be undone.')
      .subscribe(confirmed => {
        if (!confirmed) return;
        this.departmentsApi.remove(id).subscribe(() => {
          this.notify('Department deleted', 'danger');
          this.loadDepartments();
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
