import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DatePipe, TitleCasePipe } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AttendanceApi, AttendanceRecord } from '../../core/api/attendance.api';
import { AttendanceDialogComponent } from './attendance-dialog/attendance-dialog.component';
import { ConfirmDialogComponent } from '../../core/ui/confirm-dialog/confirm-dialog.component';

const COLORS = ['#6366f1','#8b5cf6','#3b82f6','#22c55e','#f97316','#ec4899','#14b8a6'];

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatIconModule, MatButtonModule, MatMenuModule, MatSnackBarModule, DatePipe, TitleCasePipe, ConfirmDialogComponent],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css',
})
export class AttendanceComponent implements OnInit {
  readonly records = signal<AttendanceRecord[]>([]);
  readonly searchControl = new FormControl('');
  readonly statusFilter = signal<string>('');
  readonly searchTerm = signal<string>('');

  readonly presentCount  = computed(() => this.records().filter(r => r.status === 'present').length);
  readonly absentCount   = computed(() => this.records().filter(r => r.status === 'absent').length);
  readonly lateCount     = computed(() => this.records().filter(r => r.status === 'late').length);
  readonly halfDayCount  = computed(() => this.records().filter(r => r.status === 'half_day').length);

  readonly filteredRecords = computed(() => {
    const q = this.searchTerm().toLowerCase();
    const s = this.statusFilter();
    return this.records().filter(r => {
      const matchStatus = !s || r.status === s;
      const empName = r.employee ? `${r.employee.firstName} ${r.employee.lastName}`.toLowerCase() : '';
      const matchSearch = !q || empName.includes(q) || (r.date || '').includes(q);
      return matchStatus && matchSearch;
    });
  });

  constructor(
    private readonly attendanceApi: AttendanceApi,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadRecords();
    this.searchControl.valueChanges.subscribe(v => this.searchTerm.set(v || ''));
  }

  loadRecords() {
    this.attendanceApi.list().subscribe(res => this.records.set(res.items));
  }

  setFilter(s: string) { this.statusFilter.set(s); }

  avatarColor(name: string = ''): string {
    return COLORS[(name.charCodeAt(0) || 0) % COLORS.length];
  }

  getDuration(rec: AttendanceRecord): string {
    if (!rec.checkIn || !rec.checkOut) return '—';
    const diff = new Date(rec.checkOut).getTime() - new Date(rec.checkIn).getTime();
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${h}h ${m}m`;
  }

  exportCsv() {
    const rows = this.filteredRecords();
    const header = 'Date,Employee,Check In,Check Out,Duration,Status';
    const lines = rows.map(r => [
      r.date,
      r.employee ? `${r.employee.firstName} ${r.employee.lastName}` : '',
      r.checkIn || '',
      r.checkOut || '',
      this.getDuration(r),
      r.status
    ].join(','));
    const blob = new Blob([[header, ...lines].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'attendance.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  openDialog(record?: AttendanceRecord) {
    const ref = this.dialog.open(AttendanceDialogComponent, { width: '560px', data: record || null, panelClass: 'premium-dialog' });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      if (record) {
        this.attendanceApi.update(record.id, result).subscribe(() => {
          this.notify('Attendance updated', 'success');
          this.loadRecords();
        });
      } else {
        this.attendanceApi.create(result).subscribe(() => {
          this.notify('Attendance created', 'success');
          this.loadRecords();
        });
      }
    });
  }

  deleteRecord(id: string) {
    this.openDeleteConfirm('Delete attendance record?', 'This action cannot be undone.')
      .subscribe(confirmed => {
        if (!confirmed) return;
        this.attendanceApi.remove(id).subscribe(() => {
          this.notify('Attendance deleted', 'danger');
          this.loadRecords();
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
