import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
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
    ReactiveFormsModule,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit {
  readonly settings = signal<Setting[]>([]);

  readonly form = this.fb.group({
    key: ['', Validators.required],
    value: ['', Validators.required],
  });

  constructor(private readonly fb: FormBuilder, private readonly settingsApi: SettingsApi) {}

  ngOnInit() {
    this.loadSettings();
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    const { key, value } = this.form.getRawValue();
    this.settingsApi.upsert(key ?? '', value ?? '').subscribe(() => {
      this.form.reset();
      this.loadSettings();
    });
  }

  private loadSettings() {
    this.settingsApi.list().subscribe((response) => this.settings.set(response.items));
  }
}
