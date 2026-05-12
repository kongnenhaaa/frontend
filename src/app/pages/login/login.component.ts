import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { DemoStore } from '../../core/demo/demo.store';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly demoEmail = 'admin@corehr.com';
  private readonly demoPassword = 'Admin@123';

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);
  readonly showPassword = signal(false);
  readonly isRegister = signal(false);

  readonly form: FormGroup;
  readonly registerForm: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  submit(seedDemo = false) {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set('Please enter your email and password.');
      return;
    }

    const { email, password } = this.form.getRawValue();
    this.loading.set(true);
    this.error.set(null);

    this.authService.login(email ?? '', password ?? '').subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigateByUrl('/dashboard');
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Login failed. Check your credentials and try again.');
      },
    });
  }

  useDemo() {
    this.form.patchValue({ email: this.demoEmail, password: this.demoPassword });
    this.loading.set(true);
    this.error.set(null);
    DemoStore.enableDemo();
    this.authService.loginDemo().subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigateByUrl('/dashboard');
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Login failed. Check your credentials and try again.');
      },
    });
  }

  submitRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.error.set('Please fill out all required fields correctly.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    // Simulate registration network request
    setTimeout(() => {
      this.loading.set(false);
      // Automatically "login" or show success message, for now let's just go back to login
      this.isRegister.set(false);
      this.form.patchValue({ email: this.registerForm.get('email')?.value });
    }, 1500);
  }

}
