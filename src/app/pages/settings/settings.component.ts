import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SettingsApi, Setting } from '../../core/api/settings.api';
import { ConfirmDialogComponent } from '../../core/ui/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatIconModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule,
    ReactiveFormsModule,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit {
  readonly settings = signal<Setting[]>([]);
  readonly isEditing = signal(false);

  readonly form: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly settingsApi: SettingsApi,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog
  ) {
    this.form = this.fb.group({
      key: ['', Validators.required],
      value: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadSettings();
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    const { key, value } = this.form.getRawValue();
    this.settingsApi.upsert(key ?? '', value ?? '').subscribe(() => {
      this.notify(this.isEditing() ? 'Setting updated' : 'Setting created', 'success');
      this.cancelEdit();
      this.loadSettings();
    });
  }

  editSetting(setting: Setting) {
    this.isEditing.set(true);
    this.form.patchValue({
      key: setting.key,
      value: setting.value
    });
  }

  cancelEdit() {
    this.isEditing.set(false);
    this.form.reset();
  }

  deleteSetting(key: string) {
    this.openDeleteConfirm(`Delete setting "${key}"?`, 'This action cannot be undone.')
      .subscribe(confirmed => {
        if (!confirmed) return;
        this.settingsApi.remove(key).subscribe(() => {
          this.notify('Setting deleted', 'danger');
          this.loadSettings();
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

  private loadSettings() {
    this.settingsApi.list().subscribe(res => this.settings.set(res.items));
  }
}
