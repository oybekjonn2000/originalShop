import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="login-container fade-in-el">
      <div class="login-card glass-panel">
        <div class="card-header">
          <h2>Xush Kelibsiz!</h2>
          <p>NexShop-ga kirish uchun login va parolingizni kiriting</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <!-- Error alert -->
          <div *ngIf="errorMessage" class="error-alert">
            {{ errorMessage }}
          </div>

          <!-- Username -->
          <div class="form-group">
            <label class="glass-label" for="username">Foydalanuvchi nomi</label>
            <input 
              type="text" 
              id="username" 
              formControlName="username" 
              class="glass-input" 
              [class.invalid]="isSubmitted && f['username'].errors"
              placeholder="username" 
            />
            <div *ngIf="isSubmitted && f['username'].errors" class="validation-msg">
              <span *ngIf="f['username'].errors['required']">Foydalanuvchi nomi majburiy!</span>
            </div>
          </div>

          <!-- Password -->
          <div class="form-group">
            <label class="glass-label" for="password">Parol</label>
            <input 
              type="password" 
              id="password" 
              formControlName="password" 
              class="glass-input" 
              [class.invalid]="isSubmitted && f['password'].errors"
              placeholder="••••••••" 
            />
            <div *ngIf="isSubmitted && f['password'].errors" class="validation-msg">
              <span *ngIf="f['password'].errors['required']">Parol majburiy!</span>
            </div>
          </div>

          <!-- Submit -->
          <button type="submit" [disabled]="isLoading" class="btn-primary btn-block">
            <span *ngIf="!isLoading">Tizimga kirish</span>
            <span *ngIf="isLoading">Tekshirilmoqda...</span>
          </button>
        </form>

        <div class="card-footer">
          Akkountingiz yo'qmi? <a routerLink="/register">Ro'yxatdan o'ting</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: calc(80vh - 100px);
      padding: 2rem 0;
    }

    .login-card {
      width: 100%;
      max-width: 450px;
      padding: 3rem 2.5rem;
      border-radius: var(--border-radius-lg);
    }

    .card-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .card-header h2 {
      font-size: 2rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      background: var(--primary-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .card-header p {
      color: var(--text-secondary);
      font-size: 0.9rem;
      line-height: 1.4;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .invalid {
      border-color: rgba(239, 68, 68, 0.4) !important;
      box-shadow: 0 0 10px rgba(239, 68, 68, 0.1) !important;
    }

    .validation-msg {
      color: #f87171;
      font-size: 0.8rem;
      margin-top: 0.35rem;
      font-weight: 500;
    }

    .error-alert {
      padding: 0.85rem 1rem;
      border-radius: var(--border-radius-sm);
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.2);
      color: #f87171;
      font-size: 0.9rem;
      font-weight: 500;
      text-align: center;
    }

    .btn-block {
      width: 100%;
      height: 46px;
      margin-top: 0.75rem;
    }

    .card-footer {
      text-align: center;
      margin-top: 2rem;
      font-size: 0.9rem;
      color: var(--text-secondary);
    }

    .card-footer a {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 600;
      transition: var(--transition-smooth);
    }

    .card-footer a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  isSubmitted = false;
  errorMessage = '';
  returnUrl = '/';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }

    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // Get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.isSubmitted = true;
    this.errorMessage = '';

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || err.error?.error || 'Kirishda xatolik yuz berdi! Username yoki parolni tekshiring.';
      }
    });
  }
}
