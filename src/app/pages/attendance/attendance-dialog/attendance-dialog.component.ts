import { Component, Inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AttendanceRecord } from '../../../core/api/attendance.api';
import { EmployeesApi, Employee } from '../../../core/api/employees.api';

@Component({
  selector: 'app-attendance-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './attendance-dialog.component.html',
  styleUrl: './attendance-dialog.component.css',
})
// Force recompile to pick up CSS
export class AttendanceDialogComponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  employees = signal<Employee[]>([]);

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<AttendanceDialogComponent>,
    private readonly employeesApi: EmployeesApi,
    @Inject(MAT_DIALOG_DATA) public data: AttendanceRecord | null
  ) {
    this.isEdit = !!data;
    this.form = this.fb.group({
      employeeId: [data?.employee?.id || '', Validators.required],
      date: [data?.date || new Date(), Validators.required],
      checkIn: [data?.checkIn || ''],
      checkOut: [data?.checkOut || ''],
      status: [data?.status || 'present', Validators.required],
    });
  }

  ngOnInit() {
    this.employeesApi.list({ limit: 1000 }).subscribe(res => {
      this.employees.set(res.items);
    });
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  close() {
    this.dialogRef.close();
  }
}
