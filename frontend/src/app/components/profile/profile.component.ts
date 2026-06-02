import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
          <p class="user-email">{{ user?.email }}</p>
          <div class="user-role-badge" *ngIf="user?.role === 'ROLE_ADMIN'">Admin</div>

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

          <button (click)="logout()" class="btn-secondary w-full mt-4 btn-logout">Tizimdan chiqish</button>
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
                <span class="order-total">{{ order.totalAmount | number:'1.2-2' }} so'm</span>
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
      grid-template-columns: 320px 1fr;
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
      margin: 2rem 0;
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
    .mt-4 { margin-top: 2rem; }

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

  constructor(
    private authService: AuthService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;
    this.loadOrders();
  }

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
