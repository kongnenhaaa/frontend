import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SettingsApi, Setting } from '../../core/api/settings.api';

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
    ReactiveFormsModule,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit {
  readonly settings = signal<Setting[]>([]);
  readonly isEditing = signal(false);

  readonly form: FormGroup;

  constructor(private readonly fb: FormBuilder, private readonly settingsApi: SettingsApi) {
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
    if (confirm(`Delete setting "${key}"?`)) {
      this.settingsApi.remove(key).subscribe(() => this.loadSettings());
    }
  }

  private loadSettings() {
    this.settingsApi.list().subscribe(res => this.settings.set(res.items));
  }
}
