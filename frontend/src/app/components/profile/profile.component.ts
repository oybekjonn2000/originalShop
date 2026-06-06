import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="profile-container fade-in-el">
      <div class="page-header text-center">
        <h1>Shaxsiy Kabinet</h1>
        <p class="subtitle">Sizning ma'lumotlaringiz va buyurtmalar tarixingiz</p>
      </div>

      <div class="profile-layout">
        <!-- User Info -->
        <aside class="profile-sidebar glass-panel">
          <div class="user-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
          <h2 class="user-name">{{ user?.firstName }} {{ user?.lastName }}</h2>
          <p class="user-username">&#64;{{ user?.username }}</p>
          <div class="user-role-badge" *ngIf="user?.role === 'ROLE_ADMIN'">Admin</div>

          <div class="sidebar-divider"></div>

          <!-- Full Profile Info -->
          <div class="profile-info-list">
            <div class="info-item">
              <div class="info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <div class="info-content">
                <span class="info-label">Email</span>
                <span class="info-value">{{ user?.email }}</span>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <div class="info-content">
                <span class="info-label">Telefon</span>
                <span class="info-value">{{ user?.phoneNumber || 'Ko\\'rilmagan' }}</span>
              </div>
            </div>

            <div class="info-item">
              <div class="info-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <div class="info-content">
                <span class="info-label">Manzil</span>
                <span class="info-value">{{ user?.address || 'Ko\\'rilmagan' }}</span>
              </div>
            </div>
          </div>

          <div class="sidebar-divider"></div>

          <div class="profile-stats">
            <div class="stat-box">
              <span class="stat-value">{{ orders.length }}</span>
              <span class="stat-label">Jami buyurtmalar</span>
            </div>
            <div class="stat-box">
              <span class="stat-value">{{ user?.id }}</span>
              <span class="stat-label">Foydalanuvchi ID</span>
            </div>
          </div>

          <div class="sidebar-divider"></div>

          <!-- Password Change Toggle -->
          <button (click)="showPasswordForm = !showPasswordForm" class="btn-secondary w-full btn-password-toggle">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <span>{{ showPasswordForm ? 'Bekor qilish' : 'Parolni o\\'zgartirish' }}</span>
          </button>

          <!-- Password Change Form -->
          <div *ngIf="showPasswordForm" class="password-form-container" @slideDown>
            <form [formGroup]="passwordForm" (ngSubmit)="onChangePassword()" class="password-form">
              <div *ngIf="passwordError" class="mini-alert mini-alert-error">{{ passwordError }}</div>
              <div *ngIf="passwordSuccess" class="mini-alert mini-alert-success">{{ passwordSuccess }}</div>

              <div class="form-group-mini">
                <label for="currentPassword">Joriy parol</label>
                <input
                  type="password"
                  id="currentPassword"
                  formControlName="currentPassword"
                  class="glass-input glass-input-sm"
                  [class.invalid]="passwordSubmitted && pf['currentPassword'].errors"
                  placeholder="••••••••"
                />
                <div *ngIf="passwordSubmitted && pf['currentPassword'].errors" class="validation-msg">
                  <span *ngIf="pf['currentPassword'].errors['required']">Joriy parol majburiy!</span>
                </div>
              </div>

              <div class="form-group-mini">
                <label for="newPassword">Yangi parol</label>
                <input
                  type="password"
                  id="newPassword"
                  formControlName="newPassword"
                  class="glass-input glass-input-sm"
                  [class.invalid]="passwordSubmitted && pf['newPassword'].errors"
                  placeholder="••••••••"
                />
                <div *ngIf="passwordSubmitted && pf['newPassword'].errors" class="validation-msg">
                  <span *ngIf="pf['newPassword'].errors['required']">Yangi parol majburiy!</span>
                  <span *ngIf="pf['newPassword'].errors['minlength']">Kamida 6 ta belgi!</span>
                </div>
              </div>

              <div class="form-group-mini">
                <label for="confirmPassword">Yangi parolni tasdiqlang</label>
                <input
                  type="password"
                  id="confirmPassword"
                  formControlName="confirmPassword"
                  class="glass-input glass-input-sm"
                  [class.invalid]="passwordSubmitted && pf['confirmPassword'].errors"
                  placeholder="••••••••"
                />
                <div *ngIf="passwordSubmitted && pf['confirmPassword'].errors" class="validation-msg">
                  <span *ngIf="pf['confirmPassword'].errors['required']">Tasdiqlash majburiy!</span>
                </div>
                <div *ngIf="passwordSubmitted && passwordForm.errors?.['mismatch']" class="validation-msg">
                  <span>Parollar mos kelmayapti!</span>
                </div>
              </div>

              <button type="submit" [disabled]="isPasswordLoading" class="btn-primary w-full btn-sm">
                <span *ngIf="!isPasswordLoading">Parolni o'zgartirish</span>
                <span *ngIf="isPasswordLoading">Saqlanmoqda...</span>
              </button>
            </form>
          </div>

          <button (click)="logout()" class="btn-secondary w-full mt-2 btn-logout">Tizimdan chiqish</button>
        </aside>

        <!-- Orders History -->
        <main class="profile-main glass-panel">
          <h3>Mening Buyurtmalarim</h3>
          
          <div *ngIf="isLoading" class="loading-state">
            <div class="spinner"></div>
            <p>Buyurtmalar yuklanmoqda...</p>
          </div>

          <div *ngIf="!isLoading && orders.length === 0" class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            <h4>Hali buyurtmalar yo'q</h4>
            <p>Siz hali hech qanday xarid amalga oshirmadingiz.</p>
            <a routerLink="/catalog" class="btn-primary mt-2">Katalogga o'tish</a>
          </div>

          <div *ngIf="!isLoading && orders.length > 0" class="orders-list">
            <div *ngFor="let order of orders" class="order-card">
              <div class="order-header">
                <div>
                  <span class="order-id">Buyurtma #{{ order.id }}</span>
                  <span class="order-date">{{ order.orderDate | date:'dd.MM.yyyy HH:mm' }}</span>
                </div>
                <div class="order-status" [ngClass]="getStatusClass(order.status)">
                  {{ order.status }}
                </div>
              </div>
              <div class="order-body">
                <div class="order-address">
                  <strong>Manzil:</strong> {{ order.shippingAddress }}
                </div>
                <div class="order-items">
                  <strong>Mahsulotlar:</strong> {{ order.items?.length || 0 }} xil
                </div>
              </div>
              <div class="order-footer">
                <span class="order-total">{{ order.totalAmount | number:'1.0-0' }} so'm</span>
                <button routerLink="/orders" class="btn-icon" title="Batafsil">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .page-header {
      margin-bottom: 3rem;
      margin-top: 1rem;
    }

    .page-header h1 {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      background: var(--primary-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .profile-layout {
      display: grid;
      grid-template-columns: 360px 1fr;
      gap: 2rem;
      align-items: start;
    }

    /* Sidebar */
    .profile-sidebar {
      padding: 2.5rem 2rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .user-avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(236, 72, 153, 0.1));
      border: 2px solid rgba(168, 85, 247, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #a855f7;
      margin-bottom: 1.5rem;
    }

    .user-name {
      font-size: 1.4rem;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 0.25rem;
    }

    .user-username {
      font-size: 0.9rem;
      color: var(--text-secondary);
      opacity: 0.7;
      margin-bottom: 0.5rem;
    }

    .user-email {
      font-size: 0.95rem;
      color: var(--text-secondary);
      margin-bottom: 1rem;
    }

    .user-role-badge {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.05em;
    }

    .sidebar-divider {
      width: 100%;
      height: 1px;
      background: var(--glass-border);
      margin: 1.5rem 0;
    }

    /* Profile Info List */
    .profile-info-list {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    .info-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      text-align: left;
      padding: 0.65rem 0.85rem;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.04);
      transition: var(--transition-smooth);
    }

    .info-item:hover {
      background: rgba(168, 85, 247, 0.05);
      border-color: rgba(168, 85, 247, 0.15);
    }

    .info-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(236, 72, 153, 0.08));
      display: flex;
      align-items: center;
      justify-content: center;
      color: #a855f7;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .info-content {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      min-width: 0;
    }

    .info-label {
      font-size: 0.7rem;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-weight: 600;
    }

    .info-value {
      font-size: 0.9rem;
      color: var(--text-primary);
      font-weight: 500;
      word-break: break-word;
    }

    .profile-stats {
      display: flex;
      width: 100%;
      justify-content: space-around;
      gap: 1rem;
    }

    .stat-box {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }

    .stat-value {
      font-size: 1.6rem;
      font-weight: 800;
      color: var(--text-primary);
      font-family: var(--font-heading);
    }

    .stat-label {
      font-size: 0.8rem;
      color: var(--text-secondary);
      text-transform: uppercase;
    }

    .w-full { width: 100%; }
    .mt-2 { margin-top: 1rem; }
    .mt-4 { margin-top: 2rem; }

    /* Password toggle button */
    .btn-password-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      border-color: rgba(168, 85, 247, 0.3);
      color: #a855f7;
    }

    .btn-password-toggle:hover {
      background: rgba(168, 85, 247, 0.1);
      border-color: #a855f7;
    }

    /* Password Form */
    .password-form-container {
      width: 100%;
      margin-top: 1rem;
      animation: slideDown 0.3s ease-out;
    }

    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); max-height: 0; }
      to { opacity: 1; transform: translateY(0); max-height: 500px; }
    }

    .password-form {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      padding: 1.25rem;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--glass-border);
    }

    .form-group-mini {
      display: flex;
      flex-direction: column;
      text-align: left;
    }

    .form-group-mini label {
      font-size: 0.8rem;
      color: var(--text-secondary);
      margin-bottom: 0.35rem;
      font-weight: 500;
    }

    .glass-input-sm {
      padding: 0.55rem 0.85rem !important;
      font-size: 0.875rem !important;
    }

    .btn-sm {
      height: 38px !important;
      font-size: 0.875rem !important;
    }

    .invalid {
      border-color: rgba(239, 68, 68, 0.4) !important;
      box-shadow: 0 0 10px rgba(239, 68, 68, 0.1) !important;
    }

    .validation-msg {
      color: #f87171;
      font-size: 0.75rem;
      margin-top: 0.25rem;
      font-weight: 500;
    }

    .mini-alert {
      padding: 0.6rem 0.85rem;
      border-radius: 8px;
      font-size: 0.8rem;
      font-weight: 500;
      animation: alertSlideIn 0.3s ease;
    }

    .mini-alert-error {
      background: rgba(239, 68, 68, 0.08);
      border: 1px solid rgba(239, 68, 68, 0.25);
      color: #f87171;
    }

    .mini-alert-success {
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.25);
      color: #34d399;
    }

    @keyframes alertSlideIn {
      from { opacity: 0; transform: translateY(-5px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .btn-logout {
      border-color: rgba(239, 68, 68, 0.3);
      color: #ef4444;
    }
    
    .btn-logout:hover {
      background: rgba(239, 68, 68, 0.1);
      border-color: #ef4444;
    }

    /* Main Area */
    .profile-main {
      padding: 2.5rem;
    }

    .profile-main h3 {
      font-size: 1.3rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid var(--glass-border);
      padding-bottom: 1rem;
    }

    .loading-state, .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 1rem;
      text-align: center;
    }

    .empty-state svg {
      color: var(--text-secondary);
      opacity: 0.4;
      margin-bottom: 1rem;
    }

    .empty-state h4 {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
    }

    .empty-state p {
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px dashed #a855f7;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin { 100% { transform: rotate(360deg); } }

    /* Orders List */
    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .order-card {
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.02);
      padding: 1.25rem;
      transition: var(--transition-smooth);
    }

    .order-card:hover {
      background: rgba(255, 255, 255, 0.04);
      border-color: rgba(168, 85, 247, 0.3);
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .order-id {
      font-weight: 700;
      font-size: 1.1rem;
      margin-right: 1rem;
    }

    .order-date {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .order-status {
      padding: 0.3rem 0.8rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      background: rgba(255, 255, 255, 0.1);
    }
    
    .status-pending { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
    .status-processing { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
    .status-shipped { background: rgba(168, 85, 247, 0.2); color: #c084fc; }
    .status-delivered { background: rgba(16, 185, 129, 0.2); color: #34d399; }
    .status-cancelled { background: rgba(239, 68, 68, 0.2); color: #f87171; }

    .order-body {
      color: var(--text-secondary);
      font-size: 0.95rem;
      line-height: 1.6;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px dashed var(--glass-border);
    }

    .order-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .order-total {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--primary-color);
      font-family: var(--font-heading);
    }

    .btn-icon {
      background: none;
      border: 1px solid var(--glass-border);
      color: var(--text-primary);
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: var(--transition-smooth);
    }

    .btn-icon:hover {
      background: rgba(168, 85, 247, 0.1);
      border-color: #a855f7;
      color: #a855f7;
    }

    @media (max-width: 800px) {
      .profile-layout {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  user: any = null;
  orders: any[] = [];
  isLoading = true;

  // Password change
  showPasswordForm = false;
  passwordForm!: FormGroup;
  passwordSubmitted = false;
  isPasswordLoading = false;
  passwordError = '';
  passwordSuccess = '';

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;
    this.loadOrders();

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  get pf() { return this.passwordForm.controls; }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getMyOrders().subscribe({
      next: (res) => {
        this.orders = res;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onChangePassword(): void {
    this.passwordSubmitted = true;
    this.passwordError = '';
    this.passwordSuccess = '';

    if (this.passwordForm.invalid) {
      return;
    }

    this.isPasswordLoading = true;

    const payload = {
      currentPassword: this.passwordForm.value.currentPassword,
      newPassword: this.passwordForm.value.newPassword
    };

    this.authService.changePassword(payload).subscribe({
      next: (res: any) => {
        this.isPasswordLoading = false;
        this.passwordSuccess = res.message || 'Parol muvaffaqiyatli o\'zgartirildi!';
        this.passwordForm.reset();
        this.passwordSubmitted = false;
        setTimeout(() => {
          this.showPasswordForm = false;
          this.passwordSuccess = '';
        }, 3000);
      },
      error: (err) => {
        this.isPasswordLoading = false;
        this.passwordError = err.error?.error || 'Parolni o\'zgartirishda xatolik yuz berdi!';
      }
    });
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/login';
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'PENDING': return 'status-pending';
      case 'PROCESSING': return 'status-processing';
      case 'SHIPPED': return 'status-shipped';
      case 'DELIVERED': return 'status-delivered';
      case 'CANCELLED': return 'status-cancelled';
      default: return '';
    }
  }
}
