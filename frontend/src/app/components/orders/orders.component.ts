import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="orders-container fade-in-el">
      <h1 class="page-title">Mening buyurtmalarim</h1>

      <!-- Empty state -->
      <div *ngIf="orders.length === 0 && !isLoading" class="empty-orders glass-panel">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="empty-icon"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        <h3>Sizda hali buyurtmalar yo'q</h3>
        <p>Buyurtma berganingizdan so'ng, ularning holatini ushbu sahifada kuzatib borishingiz mumkin.</p>
        <a routerLink="/" class="btn-primary">Katalogga o'tish</a>
      </div>

      <!-- Orders List -->
      <div *ngIf="orders.length > 0 && !isLoading" class="orders-list">
        <div *ngFor="let order of orders" class="order-card glass-panel">
          <!-- Card Header Summary -->
          <div class="order-header">
            <div class="header-info">
              <span class="order-id">Buyurtma #{{ order.id }}</span>
              <span class="order-date">{{ order.orderDate | date:'medium' }}</span>
            </div>

            <div class="header-status">
              <span class="badge" [ngClass]="getStatusClass(order.status)">
                {{ order.status }}
              </span>
            </div>
          </div>

          <!-- Address -->
          <div class="order-address">
            <strong>Yetkazib berish manzili:</strong> {{ order.shippingAddress }}
          </div>

          <!-- Items Accordion / Details -->
          <div class="order-items-detail">
            <h4>Mahsulotlar</h4>
            <div class="items-list">
              <div *ngFor="let item of order.orderItems" class="detail-item">
                <div class="item-img-mini">
                  <img [src]="item.product.imageUrl" [alt]="item.product.name" />
                </div>
                <div class="item-name-qty">
                  <span class="name">{{ item.product.name }}</span>
                  <span class="qty">Soni: {{ item.quantity }} ta</span>
                </div>
                <div class="item-subtotal">
                  {{ item.price * item.quantity | number:'1.2-2' }} so'm
                  <small class="unit-price">({{ item.price | number:'1.2-2' }} so'm/dona)</small>
                </div>
              </div>
            </div>
          </div>

          <!-- Total price footer -->
          <div class="order-footer">
            <span class="total-label">Jami to'lov summasi:</span>
            <span class="total-val">{{ order.totalAmount | number:'1.2-2' }} so'm</span>
          </div>
        </div>
      </div>

      <!-- Loading spinner -->
      <div class="loading-container" *ngIf="isLoading">
        <div class="spinner"></div>
        <p>Buyurtmalar yuklanmoqda...</p>
      </div>
    </div>
  `,
  styles: [`
    .orders-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .page-title {
      font-size: 2.2rem;
      font-weight: 800;
      margin-bottom: 2rem;
      font-family: var(--font-heading);
    }

    .empty-orders {
      padding: 5rem 2rem;
      text-align: center;
      max-width: 600px;
      margin: 3rem auto;
    }

    .empty-icon {
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
      opacity: 0.5;
    }

    .empty-orders h3 {
      font-size: 1.5rem;
      margin-bottom: 0.75rem;
    }

    .empty-orders p {
      color: var(--text-secondary);
      margin-bottom: 2rem;
    }

    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .order-card {
      padding: 2rem;
    }

    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--glass-border);
      padding-bottom: 1rem;
      margin-bottom: 1.25rem;
    }

    .header-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .order-id {
      font-size: 1.2rem;
      font-weight: 800;
      color: var(--text-primary);
      font-family: var(--font-heading);
    }

    .order-date {
      font-size: 0.85rem;
      color: var(--text-secondary);
    }

    .order-address {
      font-size: 0.95rem;
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
      background: rgba(255, 255, 255, 0.01);
      padding: 0.75rem 1rem;
      border-radius: 8px;
      border: 1px solid var(--glass-border);
    }

    .order-items-detail h4 {
      font-size: 1rem;
      margin-bottom: 0.85rem;
      color: var(--text-primary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .items-list {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      margin-bottom: 1.5rem;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.65rem 1rem;
      background: rgba(255, 255, 255, 0.02);
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.04);
    }

    .item-img-mini {
      width: 48px;
      height: 48px;
      border-radius: 6px;
      overflow: hidden;
      flex-shrink: 0;
      border: 1px solid var(--glass-border);
      background: rgba(0, 0, 0, 0.1);
    }

    .item-img-mini img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .item-name-qty {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }

    .item-name-qty .name {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .item-name-qty .qty {
      font-size: 0.8rem;
      color: var(--text-secondary);
    }

    .item-subtotal {
      text-align: right;
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--text-primary);
      display: flex;
      flex-direction: column;
    }

    .unit-price {
      font-size: 0.7rem;
      color: var(--text-secondary);
      font-weight: 400;
    }

    .order-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid var(--glass-border);
      padding-top: 1.25rem;
      margin-top: 1rem;
    }

    .total-label {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-secondary);
    }

    .total-val {
      font-size: 1.6rem;
      font-weight: 800;
      background: var(--primary-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-family: var(--font-heading);
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 8rem 0;
      color: var(--text-secondary);
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px dashed var(--primary-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin {
      100% { transform: rotate(360deg); }
    }
  `]
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];
  isLoading = true;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getMyOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'PENDING': return 'badge-pending';
      case 'PROCESSING': return 'badge-processing';
      case 'SHIPPED': return 'badge-shipped';
      case 'DELIVERED': return 'badge-delivered';
      case 'CANCELLED': return 'badge-cancelled';
      default: return 'badge-pending';
    }
  }
}
