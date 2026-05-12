import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Department } from '../../../core/api/departments.api';

@Component({
  selector: 'app-department-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './department-dialog.component.html',
  styleUrl: './department-dialog.component.css',
})
// Force recompile to pick up CSS
export class DepartmentDialogComponent {
  form: FormGroup;
  isEdit = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<DepartmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Department | null
  ) {
    this.isEdit = !!data;
    this.form = this.fb.group({
      name: [data?.name || '', Validators.required],
      description: [data?.description || ''],
      isActive: [data ? data.isActive : true],
    });
  }

  save() { if (this.form.valid) this.dialogRef.close(this.form.value); }
  close() { this.dialogRef.close(); }
}
