import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="register-container fade-in-el">
      <div class="register-card glass-panel">
        <div class="card-header">
          <h2>Ro'yxatdan O'tish</h2>
          <p>NexShop tizimida yangi hisob yaratish uchun ma'lumotlarni kiriting</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
          <!-- Error alert -->
          <div *ngIf="errorMessage" class="error-alert">
            {{ errorMessage }}
          </div>
          <!-- Success alert -->
          <div *ngIf="successMessage" class="success-alert">
            {{ successMessage }}
          </div>

          <div class="form-row">
            <!-- Firstname -->
            <div class="form-group flex-1">
              <label class="glass-label" for="firstName">Ism</label>
              <input 
                type="text" 
                id="firstName" 
                formControlName="firstName" 
                class="glass-input" 
                [class.invalid]="isSubmitted && f['firstName'].errors"
                placeholder="Eldor" 
              />
            </div>

            <!-- Lastname -->
            <div class="form-group flex-1">
              <label class="glass-label" for="lastName">Familiya</label>
              <input 
                type="text" 
                id="lastName" 
                formControlName="lastName" 
                class="glass-input" 
                [class.invalid]="isSubmitted && f['lastName'].errors"
                placeholder="Karimov" 
              />
            </div>
          </div>

          <!-- Username -->
          <div class="form-group">
            <label class="glass-label" for="username">Foydalanuvchi nomi (login)</label>
            <input 
              type="text" 
              id="username" 
              formControlName="username" 
              class="glass-input" 
              [class.invalid]="isSubmitted && f['username'].errors"
              placeholder="eldor_dev" 
            />
            <div *ngIf="isSubmitted && f['username'].errors" class="validation-msg">
              <span *ngIf="f['username'].errors['required']">Foydalanuvchi nomi majburiy!</span>
              <span *ngIf="f['username'].errors['minlength']">Foydalanuvchi nomi kamida 3 ta belgidan iborat bo'lishi kerak!</span>
            </div>
          </div>

          <!-- Email -->
          <div class="form-group">
            <label class="glass-label" for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              formControlName="email" 
              class="glass-input" 
              [class.invalid]="isSubmitted && f['email'].errors"
              placeholder="example@gmail.com" 
            />
            <div *ngIf="isSubmitted && f['email'].errors" class="validation-msg">
              <span *ngIf="f['email'].errors['required']">Email majburiy!</span>
              <span *ngIf="f['email'].errors['email']">Email formatini tekshiring!</span>
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
              <span *ngIf="f['password'].errors['minlength']">Parol kamida 6 ta belgidan iborat bo'lishi kerak!</span>
            </div>
          </div>

          <!-- Address -->
          <div class="form-group">
            <label class="glass-label" for="address">Yetkazib berish manzili</label>
            <input 
              type="text" 
              id="address" 
              formControlName="address" 
              class="glass-input" 
              placeholder="Toshkent shahar, Yunusobod tumani, 4-dha" 
            />
          </div>

          <!-- Submit -->
          <button type="submit" [disabled]="isLoading" class="btn-primary btn-block">
            <span *ngIf="!isLoading">Ro'yxatdan o'tish</span>
            <span *ngIf="isLoading">Yaratilmoqda...</span>
          </button>
        </form>

        <div class="card-footer">
          Akkountingiz bormi? <a routerLink="/login">Kirish</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: calc(85vh - 100px);
      padding: 2rem 0;
    }

    .register-card {
      width: 100%;
      max-width: 500px;
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

    .register-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .form-row {
      display: flex;
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .flex-1 {
      flex: 1;
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

    .success-alert {
      padding: 0.85rem 1rem;
      border-radius: var(--border-radius-sm);
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.2);
      color: #34d399;
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

    @media (max-width: 480px) {
      .form-row {
        flex-direction: column;
        gap: 1.25rem;
      }
    }
  `]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  isSubmitted = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }

    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: [''],
      lastName: [''],
      address: ['']
    });
  }

  get f() { return this.registerForm.controls; }

  onSubmit(): void {
    this.isSubmitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.authService.register(this.registerForm.value).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.successMessage = res.message || 'Muvaffaqiyatli ro\'yxatdan o\'tdingiz! Login sahifasiga yo\'naltirilmoqda...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.error || 'Ro\'yxatdan o\'tishda xatolik yuz berdi. Email yoki login band bo\'lishi mumkin.';
      }
    });
  }
}
