import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { EmployeesApi, Employee } from '../../core/api/employees.api';
import { EmployeeDialogComponent } from './employee-dialog/employee-dialog.component';
import { ConfirmDialogComponent } from '../../core/ui/confirm-dialog/confirm-dialog.component';

const AVATAR_COLORS = [
  '#6366f1','#8b5cf6','#3b82f6','#22c55e','#f97316','#ec4899','#14b8a6','#f59e0b'
];

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    TitleCasePipe,
  ],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css',
})
export class EmployeesComponent implements OnInit {
  private allData = signal<Employee[]>([]);

  readonly total     = signal(0);
  readonly pageSize  = signal(10);
  readonly pageIndex = signal(0);
  readonly statusFilter = signal('');

  searchControl = new FormControl('');

  // Derived counts
  readonly activeCount   = computed(() => this.allData().filter(e => e.status === 'active').length);
  readonly onLeaveCount  = computed(() => this.allData().filter(e => e.status === 'on_leave').length);
  readonly inactiveCount = computed(() => this.allData().filter(e => e.status === 'inactive' || e.status === 'terminated').length);

  readonly filteredData = computed(() => {
    const q = (this.searchControl.value || '').toLowerCase();
    const sf = this.statusFilter();
    return this.allData().filter(e => {
      const matchQ = !q ||
        `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) ||
        (e.email || '').toLowerCase().includes(q) ||
        (e.code || '').toLowerCase().includes(q);
      const matchS = !sf || e.status === sf;
      return matchQ && matchS;
    });
  });

  readonly pagedData = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filteredData().slice(start, start + this.pageSize());
  });

  readonly pages = computed(() => {
    const count = Math.ceil(this.filteredData().length / this.pageSize());
    return Array.from({ length: count }, (_, i) => i + 1);
  });

  constructor(
    private readonly employeesApi: EmployeesApi,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadData();
    this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => { this.pageIndex.set(0); this.loadData(); });
  }

  loadData() {
    this.employeesApi.list({ page: 1, limit: 500 }).subscribe(res => {
      this.allData.set(res.items);
      this.total.set(res.meta.total);
    });
  }

  setFilter(f: string) { this.statusFilter.set(f); this.pageIndex.set(0); }

  avatarColor(name: string = ''): string {
    const idx = (name.charCodeAt(0) || 0) % AVATAR_COLORS.length;
    return AVATAR_COLORS[idx];
  }

  min(a: number, b: number) { return Math.min(a, b); }
  prevPage() { if (this.pageIndex() > 0) this.pageIndex.update(p => p - 1); }
  nextPage() { if ((this.pageIndex() + 1) * this.pageSize() < this.filteredData().length) this.pageIndex.update(p => p + 1); }
  goPage(p: number) { this.pageIndex.set(p); }

  openDialog(employee?: Employee) {
    const ref = this.dialog.open(EmployeeDialogComponent, { 
      width: '560px', 
      data: employee || null,
      panelClass: 'premium-dialog',
    });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      if (employee) {
        this.employeesApi.update(employee.id, result).subscribe(() => {
          this.notify('Employee updated', 'success');
          this.loadData();
        });
      } else {
        this.employeesApi.create(result).subscribe(() => {
          this.notify('Employee created', 'success');
          this.loadData();
        });
      }
    });
  }

  deleteEmployee(id: string) {
    this.openDeleteConfirm('Delete employee?', 'This action cannot be undone.')
      .subscribe(confirmed => {
        if (!confirmed) return;
        this.employeesApi.remove(id).subscribe(() => {
          this.notify('Employee deleted', 'danger');
          this.loadData();
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
