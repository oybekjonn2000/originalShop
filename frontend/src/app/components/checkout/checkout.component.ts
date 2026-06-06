import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="checkout-container fade-in-el">
      <h1 class="page-title">Rasmiylashtirish</h1>

      <div class="checkout-grid" *ngIf="!showSuccess">
        <!-- Billing/Shipping details -->
        <div class="details-section glass-panel">
          <h3>Yetkazib berish ma'lumotlari</h3>
          
          <form (ngSubmit)="onSubmit()" class="checkout-form">
            <div class="form-row">
              <div class="form-group flex-1">
                <label class="glass-label" for="region">Viloyat</label>
                <input type="text" id="region" [(ngModel)]="region" name="region" class="glass-input" placeholder="Masalan: Toshkent" required />
              </div>
              <div class="form-group flex-1">
                <label class="glass-label" for="city">Shahar</label>
                <input type="text" id="city" [(ngModel)]="city" name="city" class="glass-input" placeholder="Masalan: Toshkent" required />
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group flex-1">
                <label class="glass-label" for="district">Tuman</label>
                <input type="text" id="district" [(ngModel)]="district" name="district" class="glass-input" placeholder="Masalan: Yunusobod" required />
              </div>
              <div class="form-group flex-1">
                <label class="glass-label" for="street">Ko'cha / Uy / Xonadon</label>
                <input type="text" id="street" [(ngModel)]="street" name="street" class="glass-input" placeholder="Masalan: 4-daha, 12-uy" required />
              </div>
            </div>

            <div class="form-group">
              <label class="glass-label" for="promoCode">Promokod (ixtiyoriy)</label>
              <input type="text" id="promoCode" [(ngModel)]="promoCode" name="promoCode" class="glass-input" placeholder="Promo kod kiriting" />
            </div>

            <button type="submit" [disabled]="isLoading || !region.trim() || !city.trim() || !district.trim() || !street.trim()" class="btn-primary btn-block">
              <span *ngIf="!isLoading">Buyurtma berish ({{ totalPrice | number:'1.0-0' }} so'm)</span>
              <span *ngIf="isLoading">Buyurtma qayta ishlanmoqda...</span>
            </button>
          </form>
        </div>

        <!-- Order Summary Column -->
        <div class="summary-section glass-panel">
          <h3>Sizning buyurtmangiz</h3>
          
          <div class="items-preview">
            <div *ngFor="let item of cartItems" class="preview-item">
              <span class="item-name">{{ item.product.name }} <small>x{{ item.quantity }}</small></span>
              <span class="item-price">{{ item.product.price * item.quantity | number:'1.0-0' }} so'm</span>
            </div>
          </div>

          <div class="summary-divider"></div>

          <div class="summary-row">
            <span>Mahsulotlar jami:</span>
            <span>{{ totalPrice | number:'1.0-0' }} so'm</span>
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
        </div>
      </div>

      <!-- Success Screen -->
      <div *ngIf="showSuccess" class="success-screen glass-panel fade-in-el">
        <div class="success-icon-wrapper">
          <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
            <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
        </div>
        <h2>Buyurtmangiz muvaffaqiyatli qabul qilindi!</h2>
        <p>Buyurtma ID: <strong>#{{ createdOrderId }}</strong></p>
        <p class="secondary-text">Tez orada operatorlarimiz siz bilan bog'lanishadi.</p>
        
        <div class="success-actions">
          <a routerLink="/orders" class="btn-primary">Buyurtmalar tarixiga o'tish</a>
          <a routerLink="/" class="btn-secondary">Xaridlarni davom ettirish</a>
        </div>
      </div>
    </div>

    <!-- Material Snackbar Toast -->
    <div class="mat-snackbar" [ngClass]="toastType" *ngIf="showToastNotif">
      <div class="mat-snack-icon">
        <svg *ngIf="toastType === 'snack-success'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <svg *ngIf="toastType === 'snack-error'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
      </div>
      <span class="mat-snack-text">{{ toastMsg }}</span>
    </div>
  `,
  styles: [`
    .checkout-container {
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

    .checkout-grid {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 2.5rem;
      align-items: start;
    }

    .details-section {
      padding: 2.5rem;
    }

    .details-section h3, .summary-section h3 {
      font-size: 1.3rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid var(--glass-border);
      padding-bottom: 0.75rem;
    }

    .checkout-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-row {
      display: flex;
      gap: 1rem;
    }

    .flex-1 {
      flex: 1;
    }

    .payment-box {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--glass-border);
      padding: 1.5rem;
      border-radius: var(--border-radius-sm);
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .payment-box h4 {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .btn-block {
      width: 100%;
      height: 48px;
    }

    .summary-section {
      padding: 2.5rem;
    }

    .items-preview {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .preview-item {
      display: flex;
      justify-content: space-between;
      font-size: 0.95rem;
      color: var(--text-secondary);
    }

    .preview-item small {
      color: var(--primary-color);
      font-weight: 700;
      margin-left: 0.5rem;
    }

    .preview-item .item-price {
      color: var(--text-primary);
      font-weight: 600;
    }

    .summary-divider {
      height: 1px;
      background: var(--glass-border);
      margin: 1.25rem 0;
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

    .total-row {
      font-size: 1.1rem;
      color: var(--text-primary);
      margin-bottom: 0;
    }

    .total-price {
      font-size: 1.6rem;
      font-weight: 800;
      background: var(--primary-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-family: var(--font-heading);
    }

    /* Success Screen Styles */
    .success-screen {
      max-width: 650px;
      margin: 3rem auto;
      padding: 4rem 3rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .success-screen h2 {
      font-size: 2rem;
      font-weight: 800;
      margin-bottom: 1rem;
      background: var(--success-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .success-screen p {
      font-size: 1.1rem;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }

    .success-screen p.secondary-text {
      color: var(--text-secondary);
      margin-bottom: 2.5rem;
    }

    .success-actions {
      display: flex;
      gap: 1rem;
      width: 100%;
      justify-content: center;
    }

    /* Checkmark Animation */
    .success-icon-wrapper {
      width: 80px;
      height: 80px;
      margin-bottom: 2rem;
    }

    .checkmark__circle {
      stroke-dasharray: 166;
      stroke-dashoffset: 166;
      stroke-width: 2;
      stroke-miterlimit: 10;
      stroke: #10b981;
      fill: none;
      animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
    }

    .checkmark {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: block;
      stroke-width: 2;
      stroke: #10b981;
      stroke-miterlimit: 10;
      box-shadow: inset 0px 0px 0px #10b981;
      animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s forwards;
    }

    .checkmark__check {
      transform-origin: 50% 50%;
      stroke-dasharray: 48;
      stroke-dashoffset: 48;
      stroke-width: 3;
      stroke: #ffffff;
      animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
    }

    @keyframes stroke {
      100% { stroke-dashoffset: 0; }
    }
    @keyframes scale {
      0%, 100% { transform: none; }
      50% { transform: scale3d(1.1, 1.1, 1); }
    }
    @keyframes fill {
      100% { box-shadow: inset 0px 0px 0px 40px #10b981; }
    }

    @media (max-width: 900px) {
      .checkout-grid { grid-template-columns: 1fr; }
      .details-section, .summary-section { padding: 1.5rem; }
      .success-actions { flex-direction: column; align-items: stretch; }
      .success-actions a { text-align: center; }
    }

    @media (max-width: 768px) {
      .checkout-container { padding: 0 0.75rem; }
      .page-title { font-size: 1.8rem; }
      .success-screen { padding: 2.5rem 1.5rem; }
      .success-screen h2 { font-size: 1.5rem; }
    }

    @media (max-width: 480px) {
      .page-title { font-size: 1.5rem; }
      .form-row { flex-direction: column; gap: 0; }
      .details-section, .summary-section { padding: 1.25rem; }
      .payment-box { padding: 1rem; }
      .success-screen { padding: 2rem 1rem; margin: 1rem auto; }
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
  `]
})
export class CheckoutComponent implements OnInit {
  cartItems: any[] = [];
  totalPrice = 0;
  region = '';
  city = '';
  district = '';
  street = '';
  promoCode = '';
  isLoading = false;
  showSuccess = false;
  createdOrderId: number | null = null;

  // Toast
  showToastNotif = false;
  toastMsg = '';
  toastType: 'snack-success' | 'snack-error' = 'snack-success';
  private toastTimer: any;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Redirect if cart is empty
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.totalPrice = items.reduce((acc, item) => acc + (this.getFinalPrice(item.product.price, item.product.discount) * item.quantity), 0);
      
      if (!this.isLoading && !this.showSuccess && items.length === 0) {
        this.router.navigate(['/cart']);
      }
    });

    const user = this.authService.currentUserValue;
    // user.address might be used if parsed correctly, but skipping for simple implementation

    this.cartService.loadCart();
  }

  getFinalPrice(price: number, discount?: number): number {
    if (!discount) return price;
    return price - (price * discount / 100);
  }

  onSubmit(): void {
    if (!this.region.trim() || !this.city.trim() || !this.district.trim() || !this.street.trim()) return;

    let finalAddress = `${this.region}, ${this.city}, ${this.district}, ${this.street}`;
    if (this.promoCode.trim()) {
      finalAddress += ` (Promo: ${this.promoCode})`;
    }

    this.isLoading = true;
    this.orderService.checkout(finalAddress).subscribe({
      next: (order) => {
        this.isLoading = false;
        this.createdOrderId = order.id;
        this.showSuccess = true;
        this.cartService.loadCart(); // Refresh cart state (becomes 0)
      },
      error: (err) => {
        this.isLoading = false;
        this.showToast(err.error?.message || 'Buyurtma berishda xatolik yuz berdi!', 'snack-error');
      }
    });
  }

  showToast(message: string, type: 'snack-success' | 'snack-error' = 'snack-success'): void {
    clearTimeout(this.toastTimer);
    this.toastMsg = message;
    this.toastType = type;
    this.showToastNotif = true;
    this.toastTimer = setTimeout(() => this.showToastNotif = false, 3500);
  }
}
