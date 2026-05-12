import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Role } from '../../../core/api/roles.api';

@Component({
  selector: 'app-role-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './role-dialog.component.html',
  styleUrl: './role-dialog.component.css',
})
// Force recompile to pick up CSS
export class RoleDialogComponent {
  form: FormGroup;
  isEdit = false;

  readonly availablePermissions = [
    'employees:read', 'employees:create', 'employees:update', 'employees:delete',
    'attendance:read', 'attendance:create', 'attendance:update', 'attendance:delete',
    'departments:read', 'departments:create', 'departments:update', 'departments:delete',
    'roles:read', 'roles:create', 'roles:update', 'roles:delete',
    'reports:read', 'settings:read', 'settings:update',
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly dialogRef: MatDialogRef<RoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Role | null
  ) {
    this.isEdit = !!data;
    this.form = this.fb.group({
      name: [data?.name || '', Validators.required],
      description: [data?.description || ''],
      permissions: [data?.permissions?.map(p => p.code) || []],
    });
  }

  isPermSelected(perm: string): boolean {
    return (this.form.get('permissions')?.value || []).includes(perm);
  }

  togglePerm(perm: string) {
    const current: string[] = [...(this.form.get('permissions')?.value || [])];
    const idx = current.indexOf(perm);
    if (idx > -1) current.splice(idx, 1);
    else current.push(perm);
    this.form.get('permissions')?.setValue(current);
  }

  save() { if (this.form.valid) this.dialogRef.close(this.form.value); }
  close() { this.dialogRef.close(); }
}
