import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { EmployeesApi, Employee } from '../../core/api/employees.api';
import { EmployeeDialogComponent } from './employee-dialog/employee-dialog.component';

const AVATAR_COLORS = [
  '#6366f1','#8b5cf6','#3b82f6','#22c55e','#f97316','#ec4899','#14b8a6','#f59e0b'
];

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
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
  readonly inactiveCount = computed(() => this.allData().filter(e => e.status === 'inactive').length);

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

  readonly pages = computed(() => {
    const total = this.total();
    const size  = this.pageSize();
    const count = Math.ceil(total / size);
    return Array.from({ length: count }, (_, i) => i + 1);
  });

  constructor(
    private readonly employeesApi: EmployeesApi,
    private readonly dialog: MatDialog
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
  nextPage() { if ((this.pageIndex() + 1) * this.pageSize() < this.total()) this.pageIndex.update(p => p + 1); }
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
        this.employeesApi.update(employee.id, result).subscribe(() => this.loadData());
      } else {
        this.employeesApi.create(result).subscribe(() => this.loadData());
      }
    });
  }

  deleteEmployee(id: string) {
    if (!confirm('Delete this employee? This action cannot be undone.')) return;
    this.employeesApi.remove(id).subscribe(() => this.loadData());
  }
}
