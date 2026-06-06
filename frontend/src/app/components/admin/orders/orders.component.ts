import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="admin-orders-container fade-in-el">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1>Buyurtmalar Boshqaruvi</h1>
          <p class="subtitle">Barcha buyurtmalarni ko'rish va ularning statusini yangilash</p>
        </div>
        <a routerLink="/admin" class="btn-secondary back-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          Orqaga
        </a>
      </div>

      <!-- Stats Row -->
      <div class="stats-row">
        <div class="stat-chip glass-panel">
          <span class="stat-chip-label">Jami</span>
          <span class="stat-chip-value">{{ orders.length }}</span>
        </div>
        <div class="stat-chip glass-panel">
          <span class="stat-chip-label pending-label">Kutilmoqda</span>
          <span class="stat-chip-value pending-value">{{ countByStatus('PENDING') }}</span>
        </div>
        <div class="stat-chip glass-panel">
          <span class="stat-chip-label processing-label">Jarayonda</span>
          <span class="stat-chip-value processing-value">{{ countByStatus('PROCESSING') }}</span>
        </div>
        <div class="stat-chip glass-panel">
          <span class="stat-chip-label delivered-label">Yetkazildi</span>
          <span class="stat-chip-value delivered-value">{{ countByStatus('DELIVERED') }}</span>
        </div>
      </div>

      <!-- Filter Bar -->
      <div class="filter-bar glass-panel">
        <div class="filter-group">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input
            type="text"
            [(ngModel)]="searchTerm"
            (input)="applyFilters()"
            placeholder="Buyurtma ID yoki foydalanuvchi nomi..."
            class="glass-input search-field"
          />
        </div>
        <select [(ngModel)]="selectedStatus" (change)="applyFilters()" class="glass-input status-filter">
          <option value="">Barcha statuslar</option>
          <option value="PENDING">Kutilmoqda</option>
          <option value="PROCESSING">Jarayonda</option>
          <option value="SHIPPED">Yuborildi</option>
          <option value="DELIVERED">Yetkazildi</option>
          <option value="CANCELLED">Bekor qilindi</option>
        </select>
      </div>

      <!-- Loading -->
      <div *ngIf="isLoading" class="loading-container">
        <div class="spinner"></div>
        <p>Buyurtmalar yuklanmoqda...</p>
      </div>

      <!-- Orders Table -->
      <div *ngIf="!isLoading" class="glass-table-container">
        <table class="glass-table">
          <thead>
            <tr>
              <th>Buyurtma ID</th>
              <th>Foydalanuvchi</th>
              <th>Sana</th>
              <th>Manzil</th>
              <th>Jami</th>
              <th>Status</th>
              <th>Amallar</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let order of filteredOrders" [class.highlighted-row]="updatingOrderId === order.id">
              <td><strong class="order-id">#{{ order.id }}</strong></td>
              <td>
                <div class="user-cell">
                  <span class="user-avatar">{{ getUserInitial(order.user?.username) }}</span>
                  <span>{{ order.user?.username || '—' }}</span>
                </div>
              </td>
              <td class="date-cell">{{ order.orderDate | date:'dd.MM.yyyy' }}<br><small>{{ order.orderDate | date:'HH:mm' }}</small></td>
              <td class="address-cell" [title]="order.shippingAddress">{{ truncate(order.shippingAddress, 30) }}</td>
              <td><strong class="amount">{{ order.totalAmount | number:'1.0-0' }} so'm</strong></td>
              <td>
                <span class="badge" [ngClass]="getStatusClass(order.status)">{{ getStatusLabel(order.status) }}</span>
              </td>
              <td class="actions-cell">
                <button (click)="openDetailModal(order)" class="btn-icon btn-view" title="Batafsil ko'rish">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </button>
                <select
                  class="status-select"
                  [ngModel]="order.status"
                  (ngModelChange)="updateStatus(order, $event)"
                  [disabled]="updatingOrderId === order.id"
                >
                  <option value="PENDING">Kutilmoqda</option>
                  <option value="PROCESSING">Jarayonda</option>
                  <option value="SHIPPED">Yuborildi</option>
                  <option value="DELIVERED">Yetkazildi</option>
                  <option value="CANCELLED">Bekor qilindi</option>
                </select>
              </td>
            </tr>
            <tr *ngIf="filteredOrders.length === 0">
              <td colspan="7" class="empty-row">Buyurtmalar topilmadi</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Detail Modal -->
      <div class="modal-overlay" *ngIf="showDetailModal" (click)="closeDetailModal()">
        <div class="modal-card glass-panel" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div>
              <h2>Buyurtma #{{ selectedOrder?.id }}</h2>
              <span class="badge" [ngClass]="getStatusClass(selectedOrder?.status)">{{ getStatusLabel(selectedOrder?.status) }}</span>
            </div>
            <button (click)="closeDetailModal()" class="btn-close">✕</button>
          </div>

          <div *ngIf="selectedOrder" class="modal-body">
            <div class="detail-section">
              <div class="detail-row">
                <span class="detail-label">Foydalanuvchi</span>
                <span class="detail-value">{{ selectedOrder.user?.username }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Buyurtma sanasi</span>
                <span class="detail-value">{{ selectedOrder.orderDate | date:'dd MMMM yyyy, HH:mm' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Yetkazish manzili</span>
                <span class="detail-value">{{ selectedOrder.shippingAddress }}</span>
              </div>
            </div>

            <h3 class="items-title">Buyurtma tarkibi</h3>
            <div class="order-items-list">
              <div *ngFor="let item of selectedOrder.orderItems" class="order-item-row">
                <div class="order-item-img-wrap">
                  <img [src]="item.product?.imageUrl" [alt]="item.product?.name" class="order-item-img" />
                </div>
                <div class="order-item-info">
                  <span class="order-item-name">{{ item.product?.name }}</span>
                  <span class="order-item-qty">{{ item.quantity }} dona</span>
                </div>
                <span class="order-item-price">{{ item.price | number:'1.0-0' }} so'm</span>
              </div>
            </div>

            <div class="order-total-row">
              <span>Jami to'lov:</span>
              <strong class="order-total-amount">{{ selectedOrder.totalAmount | number:'1.0-0' }} so'm</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Material Snackbar Toast -->
      <div class="mat-snackbar" [ngClass]="toastType" *ngIf="showToast">
        <div class="mat-snack-icon">
          <svg *ngIf="toastType === 'snack-success'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <svg *ngIf="toastType === 'snack-error'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        </div>
        <span class="mat-snack-text">{{ toastMessage }}</span>
      </div>
    </div>
  `,
  styles: [`
    .admin-orders-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .page-header h1 {
      font-size: 2rem;
      font-weight: 800;
      background: linear-gradient(135deg, #f59e0b 0%, #f76b1c 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.25rem;
    }

    .subtitle { color: var(--text-secondary); font-size: 0.95rem; }

    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      text-decoration: none;
      padding: 0.6rem 1rem;
      font-size: 0.9rem;
    }

    /* Stats */
    .stats-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .stat-chip {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem 1.75rem;
      gap: 0.2rem;
      min-width: 130px;
    }

    .stat-chip-label {
      font-size: 0.75rem;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-weight: 500;
    }

    .stat-chip-value {
      font-size: 1.85rem;
      font-weight: 800;
      color: var(--text-primary);
      font-family: var(--font-heading);
      line-height: 1;
    }

    .pending-label { color: #fbbf24; }
    .pending-value { color: #fbbf24; }
    .processing-label { color: #60a5fa; }
    .processing-value { color: #60a5fa; }
    .delivered-label { color: #34d399; }
    .delivered-value { color: #34d399; }

    /* Filter */
    .filter-bar {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.85rem 1.25rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }

    .filter-group {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex: 1;
    }

    .search-icon { color: var(--text-secondary); flex-shrink: 0; }

    .search-field {
      flex: 1;
      border: none !important;
      background: transparent !important;
      padding: 0 !important;
      box-shadow: none !important;
    }

    .search-field:focus { border: none !important; box-shadow: none !important; }

    .status-filter { width: 200px; }

    /* Loading */
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 5rem 0;
      color: var(--text-secondary);
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px dashed #f59e0b;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin { 100% { transform: rotate(360deg); } }

    /* Table */
    .order-id { color: var(--primary-color); font-family: var(--font-heading); }

    .user-cell {
      display: flex;
      align-items: center;
      gap: 0.65rem;
    }

    .user-avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: linear-gradient(135deg, #4facfe, #00f2fe);
      color: #04080f;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 700;
      flex-shrink: 0;
    }

    .date-cell { font-size: 0.875rem; line-height: 1.6; }
    .date-cell small { color: var(--text-secondary); }

    .address-cell {
      font-size: 0.875rem;
      color: var(--text-secondary);
      max-width: 180px;
    }

    .amount {
      color: var(--text-primary);
      font-family: var(--font-heading);
    }

    .actions-cell {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-icon {
      width: 34px;
      height: 34px;
      border-radius: 8px;
      border: 1px solid var(--glass-border);
      background: rgba(255,255,255,0.03);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: var(--transition-smooth);
      flex-shrink: 0;
    }

    .btn-view { color: var(--primary-color); }
    .btn-view:hover { background: rgba(79, 172, 254, 0.1); border-color: var(--primary-color); }

    .status-select {
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--glass-border);
      color: var(--text-secondary);
      border-radius: 8px;
      padding: 0.35rem 0.65rem;
      font-size: 0.8rem;
      font-family: var(--font-main);
      cursor: pointer;
      transition: var(--transition-smooth);
      outline: none;
    }

    .status-select:hover { border-color: var(--primary-color); color: var(--text-primary); }
    .status-select:disabled { opacity: 0.5; cursor: not-allowed; }

    .highlighted-row td { background: rgba(79, 172, 254, 0.04) !important; }

    .empty-row {
      text-align: center;
      color: var(--text-secondary) !important;
      padding: 3rem !important;
    }

    /* Detail Modal */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(8px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      animation: fadeIn 0.2s ease;
    }

    .modal-card {
      width: 100%;
      max-width: 600px;
      padding: 2.5rem;
      border-radius: var(--border-radius-lg);
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      border-bottom: 1px solid var(--glass-border);
      padding-bottom: 1rem;
      gap: 1rem;
    }

    .modal-header h2 {
      font-size: 1.4rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .btn-close {
      background: none;
      border: none;
      color: var(--text-secondary);
      font-size: 1.2rem;
      cursor: pointer;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--transition-smooth);
      flex-shrink: 0;
    }

    .btn-close:hover { background: rgba(255,255,255,0.05); color: var(--text-primary); }

    .detail-section {
      background: rgba(255,255,255,0.02);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      padding: 1.25rem;
      margin-bottom: 1.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
    }

    .detail-label {
      font-size: 0.8rem;
      color: var(--text-secondary);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      flex-shrink: 0;
    }

    .detail-value {
      font-size: 0.9rem;
      color: var(--text-primary);
      text-align: right;
    }

    .items-title {
      font-size: 1rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .order-items-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .order-item-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.85rem;
      background: rgba(255,255,255,0.02);
      border: 1px solid var(--glass-border);
      border-radius: 10px;
    }

    .order-item-img-wrap {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      overflow: hidden;
      flex-shrink: 0;
      background: rgba(0,0,0,0.2);
    }

    .order-item-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .order-item-info {
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 0.2rem;
    }

    .order-item-name {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .order-item-qty {
      font-size: 0.8rem;
      color: var(--text-secondary);
    }

    .order-item-price {
      font-weight: 700;
      color: var(--text-primary);
      font-family: var(--font-heading);
      white-space: nowrap;
    }

    .order-total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid var(--glass-border);
      padding-top: 1.25rem;
      font-size: 1rem;
      color: var(--text-secondary);
    }

    .order-total-amount {
      font-size: 1.4rem;
      font-family: var(--font-heading);
      background: var(--success-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    /* Material Snackbar Toast */
    .mat-snackbar {
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      min-width: 300px;
      max-width: 480px;
      padding: 0.9rem 1.4rem;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-weight: 600;
      font-size: 0.9rem;
      backdrop-filter: blur(16px);
      box-shadow: 0 8px 32px rgba(0,0,0,0.35);
      z-index: 99999;
      animation: snackSlideUp 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .snack-success { background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.4); color: #34d399; }
    .snack-error   { background: rgba(239,68,68,0.15);  border: 1px solid rgba(239,68,68,0.4);  color: #f87171; }
    .mat-snack-icon { display: flex; align-items: center; flex-shrink: 0; }
    .mat-snack-text { flex: 1; line-height: 1.4; }
    @keyframes snackSlideUp {
      from { opacity: 0; transform: translateX(-50%) translateY(20px); }
      to   { opacity: 1; transform: translateX(-50%) translateY(0); }
    }

    @media (max-width: 768px) {
      .stats-row { gap: 0.75rem; }
      .stat-chip { min-width: 100px; padding: 0.75rem 1rem; }
      .filter-bar { flex-direction: column; align-items: stretch; }
      .status-filter { width: 100%; }
    }
  `]
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  searchTerm = '';
  selectedStatus = '';
  isLoading = true;
  updatingOrderId: number | null = null;

  showDetailModal = false;
  selectedOrder: any = null;

  showToast = false;
  toastMessage = '';
  toastType: 'snack-success' | 'snack-error' = 'snack-success';
  private toastTimer: any;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders.sort((a: any, b: any) =>
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        );
        this.filteredOrders = this.orders;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  applyFilters(): void {
    this.filteredOrders = this.orders.filter(order => {
      const q = this.searchTerm.toLowerCase();
      const matchSearch = !q ||
        String(order.id).includes(q) ||
        (order.user?.username && order.user.username.toLowerCase().includes(q));
      const matchStatus = !this.selectedStatus || order.status === this.selectedStatus;
      return matchSearch && matchStatus;
    });
  }

  updateStatus(order: any, newStatus: string): void {
    if (order.status === newStatus) return;
    this.updatingOrderId = order.id;
    this.orderService.updateOrderStatus(order.id, newStatus).subscribe({
      next: (updated) => {
        order.status = updated.status;
        this.updatingOrderId = null;
        this.triggerToast(`#${order.id} buyurtma statusi yangilandi!`, 'snack-success');
      },
      error: (err) => {
        this.updatingOrderId = null;
        this.triggerToast(err.error?.message || 'Statusni yangilashda xatolik!', 'snack-error');
      }
    });
  }

  openDetailModal(order: any): void {
    this.selectedOrder = order;
    this.showDetailModal = true;
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedOrder = null;
  }

  countByStatus(status: string): number {
    return this.orders.filter(o => o.status === status).length;
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

  getStatusLabel(status: string): string {
    const map: Record<string, string> = {
      'PENDING': 'Kutilmoqda',
      'PROCESSING': 'Jarayonda',
      'SHIPPED': 'Yuborildi',
      'DELIVERED': 'Yetkazildi',
      'CANCELLED': 'Bekor qilindi'
    };
    return map[status] || status;
  }

  getUserInitial(username: string): string {
    return username ? username.charAt(0).toUpperCase() : '?';
  }

  truncate(text: string, limit: number): string {
    if (!text) return '—';
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  }

  triggerToast(message: string, type: 'snack-success' | 'snack-error' = 'snack-success'): void {
    clearTimeout(this.toastTimer);
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    this.toastTimer = setTimeout(() => this.showToast = false, 3000);
  }
}
