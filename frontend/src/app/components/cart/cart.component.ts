import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="cart-container fade-in-el">
      <h1 class="page-title">Sizning savatingiz</h1>

      <!-- Empty Cart -->
      <div *ngIf="cartItems.length === 0" class="empty-cart glass-panel">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="empty-icon"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
        <h3>Savatingiz hozircha bo'sh</h3>
        <p>Katalogga o'ting va o'zingizga yoqqan mahsulotlarni qo'shing.</p>
        <a routerLink="/" class="btn-primary">Xaridlarni boshlash</a>
      </div>

      <!-- Cart Grid -->
      <div *ngIf="cartItems.length > 0" class="cart-grid">
        <!-- Cart Items List -->
        <div class="cart-items-list">
          <div *ngFor="let item of cartItems" class="cart-item glass-panel">
            <div class="item-img-wrapper">
              <img [src]="item.product.imageUrl" [alt]="item.product.name" class="item-img" />
              <div *ngIf="item.product.discount" class="cart-discount-circle">-{{ item.product.discount }}%</div>
            </div>
            
            <div class="item-info">
              <h3 [routerLink]="['/product', item.product.id]" class="item-name">{{ item.product.name }}</h3>
              <span class="item-category">{{ item.product.category?.name }}</span>
            </div>

            <div class="item-quantity">
              <button (click)="decrementQty(item)" [disabled]="item.quantity <= 1" class="qty-btn">-</button>
              <span class="qty-val">{{ item.quantity }}</span>
              <button (click)="incrementQty(item)" [disabled]="item.quantity >= item.product.stockQuantity" class="qty-btn">+</button>
            </div>

            <div class="item-price">
              <ng-container *ngIf="item.product.discount">
                <span class="old-price" style="font-size:0.8rem; text-decoration:line-through; color:var(--text-secondary); display:block; text-align:right;">{{ item.product.price * item.quantity | number:'1.0-0' }} so'm</span>
                <div style="color:var(--danger-color)">{{ getFinalPrice(item.product.price, item.product.discount) * item.quantity | number:'1.0-0' }} so'm</div>
                <small class="unit-price">
                  <span class="discount-badge" style="font-size: 0.7rem; padding: 0.1rem 0.3rem; margin-right: 0.3rem;">-{{ item.product.discount }}%</span>
                  ({{ getFinalPrice(item.product.price, item.product.discount) | number:'1.0-0' }} so'm/dona)
                </small>
              </ng-container>
              <ng-container *ngIf="!item.product.discount">
                {{ item.product.price * item.quantity | number:'1.0-0' }} so'm
                <small class="unit-price">({{ item.product.price | number:'1.0-0' }} so'm/dona)</small>
              </ng-container>
            </div>

            <button (click)="removeItem(item.id)" class="btn-remove" title="O'chirish">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </button>
          </div>
        </div>

        <!-- Cart Summary Card -->
        <div class="cart-summary glass-panel">
          <h3>Buyurtma tafsiloti</h3>
          
          <div class="summary-row">
            <span>Mahsulotlar soni:</span>
            <span>{{ totalItems }} ta</span>
          </div>

          <div class="summary-row">
            <span>Yetkazib berish:</span>
            <span class="free">Bepul</span>
          </div>

          <div class="summary-divider"></div>

          <div class="summary-row total-row">
            <span>Jami summa:</span>
            <span class="total-price">{{ totalPrice | number:'1.0-0' }} so'm</span>
          </div>

          <div class="summary-actions">
            <a routerLink="/checkout" class="btn-primary btn-block">Buyurtma berish</a>
            <button (click)="clearCart()" class="btn-clear-all">Savatni tozalash</button>
          </div>
        </div>
      </div>

      <!-- Confirm Modal -->
      <div class="modal-overlay" *ngIf="showConfirmModal" (click)="closeConfirmModal()">
        <div class="modal-card glass-panel confirm-modal" (click)="$event.stopPropagation()">
          <div class="modal-header confirm-header">
            <div class="confirm-icon-wrap">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            </div>
            <h2>{{ confirmType === 'remove' ? "O'chirishni tasdiqlang" : "Savatni tozalashni tasdiqlang" }}</h2>
          </div>
          <div class="confirm-body">
            <p>{{ confirmType === 'remove' ? "Ushbu mahsulotni savatdan o'chirmoqchimisiz?" : "Savatdagi barcha mahsulotlarni o'chirmoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi." }}</p>
          </div>
          <div class="modal-actions confirm-actions">
            <button (click)="closeConfirmModal()" class="btn-secondary">Bekor qilish</button>
            <button (click)="confirmAction()" class="btn-primary btn-danger">{{ confirmType === 'remove' ? "O'chirish" : "Tozalash" }}</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cart-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .page-title {
      font-size: 2.2rem;
      font-weight: 800;
      margin-bottom: 2rem;
      font-family: var(--font-heading);
    }

    .empty-cart {
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

    .empty-cart h3 {
      font-size: 1.5rem;
      margin-bottom: 0.75rem;
    }

    .empty-cart p {
      color: var(--text-secondary);
      margin-bottom: 2rem;
      font-size: 1rem;
    }

    .cart-grid {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 2.5rem;
      align-items: start;
    }

    .cart-items-list {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .cart-item {
      display: flex;
      align-items: center;
      padding: 1.25rem 1.75rem;
      gap: 1.5rem;
    }

    .item-img-wrapper {
      width: 80px;
      height: 80px;
      border-radius: var(--border-radius-sm);
      overflow: hidden;
      background: rgba(0, 0, 0, 0.1);
      flex-shrink: 0;
      border: 1px solid var(--glass-border);
      position: relative;
    }

    .cart-discount-circle {
      position: absolute;
      top: 4px;
      left: 4px;
      background: var(--danger-color);
      color: white;
      font-size: 0.65rem;
      font-weight: 800;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;
      box-shadow: 0 2px 4px rgba(239, 68, 68, 0.4);
    }

    .item-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .item-info {
      flex: 1;
    }

    .item-name {
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
      color: var(--text-primary);
      text-decoration: none;
      cursor: pointer;
    }

    .item-name:hover {
      color: var(--primary-color);
    }

    .item-category {
      font-size: 0.8rem;
      color: var(--text-secondary);
    }

    .item-quantity {
      display: flex;
      align-items: center;
      border: 1px solid var(--glass-border);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.02);
      overflow: hidden;
    }

    .qty-btn {
      background: none;
      border: none;
      color: var(--text-primary);
      width: 32px;
      height: 32px;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition-smooth);
    }

    .qty-btn:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.05);
      color: var(--primary-color);
    }

    .qty-btn:disabled {
      opacity: 0.25;
      cursor: not-allowed;
    }

    .qty-val {
      font-size: 0.9rem;
      font-weight: 700;
      width: 36px;
      text-align: center;
    }

    .item-price {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--text-primary);
      min-width: 110px;
      text-align: right;
      display: flex;
      flex-direction: column;
    }

    .unit-price {
      font-size: 0.75rem;
      color: var(--text-secondary);
      font-weight: 400;
      margin-top: 0.15rem;
    }

    .discount-badge {
      background: rgba(239, 68, 68, 0.1);
      color: var(--danger-color);
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-weight: 700;
      font-size: 0.85rem;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .btn-remove {
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--transition-smooth);
    }

    .btn-remove:hover {
      color: var(--danger-color);
      background: rgba(239, 68, 68, 0.08);
    }

    .cart-summary {
      padding: 2.25rem 2rem;
      position: sticky;
      top: 100px;
    }

    .cart-summary h3 {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid var(--glass-border);
      padding-bottom: 0.75rem;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
      font-size: 0.95rem;
      color: var(--text-secondary);
    }

    .summary-row span.free {
      color: var(--success-color);
      font-weight: 600;
    }

    .summary-divider {
      height: 1px;
      background: var(--glass-border);
      margin: 1.25rem 0;
    }

    .total-row {
      font-size: 1.1rem;
      color: var(--text-primary);
      margin-bottom: 1.75rem;
    }

    .total-price {
      font-size: 1.6rem;
      font-weight: 800;
      background: var(--primary-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-family: var(--font-heading);
    }

    .summary-actions {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .btn-block {
      width: 100%;
      height: 46px;
      text-decoration: none;
    }

    .btn-clear-all {
      background: none;
      border: 1px dashed rgba(239, 68, 68, 0.3);
      color: var(--danger-color);
      padding: 0.75rem;
      border-radius: var(--border-radius-sm);
      cursor: pointer;
      font-weight: 600;
      font-size: 0.9rem;
      transition: var(--transition-smooth);
    }

    .btn-clear-all:hover {
      background: rgba(239, 68, 68, 0.05);
      border-color: var(--danger-color);
    }

    @media (max-width: 992px) {
      .cart-grid { grid-template-columns: 1fr; }
      .cart-summary { position: static; }
      .page-title { font-size: 1.8rem; }
    }

    @media (max-width: 768px) {
      .cart-container { padding: 0 0.75rem; }
      .cart-item { padding: 1rem 1.25rem; gap: 1rem; }
      .item-img-wrapper { width: 65px; height: 65px; }
      .item-name { font-size: 0.95rem; }
      .item-price { font-size: 1rem; min-width: auto; }
      .unit-price { display: none; }
      .cart-summary { padding: 1.5rem; }
    }

    @media (max-width: 600px) {
      .cart-item {
        flex-wrap: wrap;
        align-items: flex-start;
        padding: 1rem;
        position: relative;
      }
      .item-info { flex: 1 1 calc(100% - 80px); }
      .item-quantity { order: 3; }
      .item-price { order: 4; text-align: left; min-width: auto; }
      .btn-remove { position: absolute; top: 12px; right: 12px; }
    }

    @media (max-width: 480px) {
      .page-title { font-size: 1.5rem; }
      .cart-items-list { gap: 0.75rem; }
      .confirm-actions { flex-direction: column; }
      .confirm-actions button { width: 100%; }
    }
    
    /* Confirm Modal CSS */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
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
      max-width: 660px;
      padding: 2.5rem;
      border-radius: var(--border-radius-lg);
      max-height: 90vh;
      overflow-y: auto;
    }
    .confirm-modal {
      max-width: 400px;
      padding: 2rem;
      text-align: center;
    }
    .confirm-header {
      flex-direction: column;
      border-bottom: none;
      padding-bottom: 0;
      margin-bottom: 1rem;
      gap: 1rem;
    }
    .confirm-header h2 {
      font-size: 1.4rem;
      font-weight: 700;
    }
    .confirm-icon-wrap {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: rgba(239, 68, 68, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--danger-color);
      margin: 0 auto;
    }
    .confirm-body p {
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
      line-height: 1.5;
    }
    .confirm-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-top: 0.5rem;
    }
    .btn-danger {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
      box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3) !important;
      border: none !important;
    }
    .btn-danger:hover {
      background: linear-gradient(135deg, #f87171 0%, #ef4444 100%) !important;
      box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4) !important;
      transform: translateY(-2px);
    }
  `]
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice = 0;
  totalItems = 0;
  
  showConfirmModal = false;
  confirmType: 'remove' | 'clear' = 'remove';
  itemToDeleteId: number | null = null;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.calculateSummary();
    });
    this.cartService.loadCart();
  }

  calculateSummary(): void {
    this.totalPrice = this.cartItems.reduce((acc, item) => acc + (this.getFinalPrice(item.product.price, item.product.discount) * item.quantity), 0);
    this.totalItems = this.cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }

  getFinalPrice(price: number, discount?: number): number {
    if (!discount) return price;
    return price - (price * discount / 100);
  }

  incrementQty(item: any): void {
    if (item.quantity < item.product.stockQuantity) {
      this.cartService.updateCartItem(item.id, item.quantity + 1).subscribe();
    }
  }

  decrementQty(item: any): void {
    if (item.quantity > 1) {
      this.cartService.updateCartItem(item.id, item.quantity - 1).subscribe();
    }
  }

  removeItem(cartItemId: number): void {
    this.confirmType = 'remove';
    this.itemToDeleteId = cartItemId;
    this.showConfirmModal = true;
  }

  clearCart(): void {
    this.confirmType = 'clear';
    this.showConfirmModal = true;
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
    this.itemToDeleteId = null;
  }

  confirmAction(): void {
    if (this.confirmType === 'remove' && this.itemToDeleteId !== null) {
      this.cartService.removeFromCart(this.itemToDeleteId).subscribe({
        next: () => this.closeConfirmModal(),
        error: () => this.closeConfirmModal()
      });
    } else if (this.confirmType === 'clear') {
      this.cartService.clearCart().subscribe({
        next: () => this.closeConfirmModal(),
        error: () => this.closeConfirmModal()
      });
    }
  }
}

