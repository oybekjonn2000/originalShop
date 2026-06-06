import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { OrderService } from '../../../services/order.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container fade-in-el">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1>Admin Panel</h1>
          <p class="subtitle">Xush kelibsiz, <strong>{{ adminName }}</strong>! NexShop boshqaruv paneli.</p>
        </div>
        <div class="header-time">{{ currentDate | date:'EEEE, d MMMM y' }}</div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card glass-panel">
          <div class="stat-icon products-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Jami Mahsulotlar</span>
            <span class="stat-value">{{ totalProducts }}</span>
          </div>
        </div>

        <div class="stat-card glass-panel">
          <div class="stat-icon orders-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Jami Buyurtmalar</span>
            <span class="stat-value">{{ totalOrders }}</span>
          </div>
        </div>

        <div class="stat-card glass-panel">
          <div class="stat-icon pending-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Kutilayotgan</span>
            <span class="stat-value">{{ pendingOrders }}</span>
          </div>
        </div>

        <div class="stat-card glass-panel">
          <div class="stat-icon revenue-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Jami Daromad</span>
            <span class="stat-value revenue">{{ totalRevenue | number:'1.0-0' }} so'm</span>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions-section">
        <h2 class="section-title">Tezkor Amallar</h2>
        <div class="actions-grid">
          <a routerLink="/admin/products" class="action-card glass-panel">
            <div class="action-icon" style="background: linear-gradient(135deg, #00f2fe, #4facfe);">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </div>
            <h3>Yangi Mahsulot</h3>
            <p>Katalogga yangi mahsulot qo'shing</p>
          </a>

          <a routerLink="/admin/categories" class="action-card glass-panel">
            <div class="action-icon" style="background: linear-gradient(135deg, #a855f7, #ec4899);">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            </div>
            <h3>Kategoriyalar</h3>
            <p>Kategoriyalarni boshqaring</p>
          </a>

          <a routerLink="/admin/brands" class="action-card glass-panel">
            <div class="action-icon" style="background: linear-gradient(135deg, #22c55e, #10b981);">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M16 12a4 4 0 0 1-8 0"></path><line x1="12" y1="8" x2="12" y2="16"></line></svg>
            </div>
            <h3>Brandlar</h3>
            <p>Brandlarni boshqaring</p>
          </a>

          <a routerLink="/admin/orders" class="action-card glass-panel">
            <div class="action-icon" style="background: linear-gradient(135deg, #f59e0b, #f76b1c);">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
            </div>
            <h3>Buyurtmalar</h3>
            <p>Buyurtmalar statusini yangilang</p>
          </a>

          <a routerLink="/" class="action-card glass-panel">
            <div class="action-icon" style="background: linear-gradient(135deg, #10b981, #059669);">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            </div>
            <h3>Magazinga qaytish</h3>
            <p>Foydalanuvchi ko'rinishiga o'ting</p>
          </a>

          <a routerLink="/admin/messages" class="action-card glass-panel">
            <div class="action-icon" style="background: linear-gradient(135deg, #6366f1, #4f46e5);">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </div>
            <h3>Xabarlar</h3>
            <p>Foydalanuvchilar murojaatlari</p>
          </a>

          <a routerLink="/admin/users" class="action-card glass-panel">
            <div class="action-icon" style="background: linear-gradient(135deg, #f43f5e, #e11d48);">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            </div>
            <h3>Foydalanuvchilar</h3>
            <p>Mijozlar va adminlar ro'yxati</p>
          </a>
        </div>
      </div>

      <!-- Recent Orders Table -->
      <div class="recent-orders-section">
        <div class="section-header">
          <h2 class="section-title">So'nggi Buyurtmalar</h2>
          <a routerLink="/admin/orders" class="view-all-link">Barchasini ko'rish →</a>
        </div>

        <div class="glass-table-container">
          <table class="glass-table">
            <thead>
              <tr>
                <th>Buyurtma ID</th>
                <th>Foydalanuvchi</th>
                <th>Sana</th>
                <th>Jami</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let order of recentOrders">
                <td><strong>#{{ order.id }}</strong></td>
                <td>{{ order.user?.username }}</td>
                <td>{{ order.orderDate | date:'dd.MM.yy HH:mm' }}</td>
                <td><strong>{{ order.totalAmount | number:'1.0-0' }} so'm</strong></td>
                <td>
                  <span class="badge" [ngClass]="getStatusClass(order.status)">{{ order.status }}</span>
                </td>
              </tr>
              <tr *ngIf="recentOrders.length === 0">
                <td colspan="5" class="empty-row">Hali buyurtmalar mavjud emas</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2.5rem;
    }

    .page-header h1 {
      font-size: 2.5rem;
      font-weight: 800;
      background: var(--primary-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.35rem;
    }

    .subtitle {
      color: var(--text-secondary);
      font-size: 1rem;
    }

    .subtitle strong {
      color: var(--text-primary);
    }

    .header-time {
      color: var(--text-secondary);
      font-size: 0.9rem;
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--glass-border);
      padding: 0.5rem 1rem;
      border-radius: 8px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      padding: 2rem;
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .products-icon { background: rgba(79, 172, 254, 0.15); color: #4facfe; }
    .orders-icon { background: rgba(168, 85, 247, 0.15); color: #a855f7; }
    .pending-icon { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
    .revenue-icon { background: rgba(16, 185, 129, 0.15); color: #10b981; }

    .stat-info {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .stat-label {
      font-size: 0.85rem;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 500;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 800;
      color: var(--text-primary);
      font-family: var(--font-heading);
      line-height: 1;
    }

    .stat-value.revenue {
      background: var(--success-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .section-header .section-title {
      margin-bottom: 0;
    }

    .view-all-link {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      transition: var(--transition-smooth);
    }

    .view-all-link:hover {
      text-decoration: underline;
    }

    .quick-actions-section {
      margin-bottom: 3rem;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 1.5rem;
    }

    .action-card {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 2rem;
      text-decoration: none;
      cursor: pointer;
    }

    .action-card:hover {
      transform: translateY(-5px);
    }

    .action-icon {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.25rem;
      color: #04080f;
    }

    .action-card h3 {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.35rem;
    }

    .action-card p {
      font-size: 0.85rem;
      color: var(--text-secondary);
    }

    .recent-orders-section {
      margin-bottom: 3rem;
    }

    .empty-row {
      text-align: center;
      color: var(--text-secondary) !important;
      padding: 2rem !important;
    }
  `]
})
export class DashboardComponent implements OnInit {
  totalProducts = 0;
  totalOrders = 0;
  pendingOrders = 0;
  totalRevenue = 0;
  recentOrders: any[] = [];
  adminName = '';
  currentDate = new Date();

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    this.adminName = user?.firstName || user?.username || 'Admin';

    this.productService.getProducts().subscribe(p => {
      this.totalProducts = p.length;
    });

    this.orderService.getAllOrders().subscribe(orders => {
      this.totalOrders = orders.length;
      this.pendingOrders = orders.filter(o => o.status === 'PENDING').length;
      this.totalRevenue = orders
        .filter(o => o.status !== 'CANCELLED')
        .reduce((acc: number, o: any) => acc + o.totalAmount, 0);
      this.recentOrders = orders.slice(0, 8);
    });
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'PENDING': 'badge-pending',
      'PROCESSING': 'badge-processing',
      'SHIPPED': 'badge-shipped',
      'DELIVERED': 'badge-delivered',
      'CANCELLED': 'badge-cancelled'
    };
    return map[status] || 'badge-pending';
  }
}
