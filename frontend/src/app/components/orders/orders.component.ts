import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
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

          <!-- Items list -->
          <div class="order-items-detail">
            <h4>Mahsulotlar</h4>
            <div class="items-list">
              <div *ngFor="let item of order.orderItems" class="item-wrapper">
                <!-- Item row -->
                <div class="detail-item">
                  <div class="item-img-mini">
                    <img [src]="item.product.imageUrl" [alt]="item.product.name" />
                  </div>
                  <div class="item-name-qty">
                    <span class="name">{{ item.product.name }}</span>
                    <span class="qty">Soni: {{ item.quantity }} ta</span>
                  </div>
                  <div class="item-right">
                    <div class="item-subtotal">
                      {{ item.price * item.quantity | number:'1.0-0' }} so'm
                      <small class="unit-price">({{ item.price | number:'1.0-0' }} so'm/dona)</small>
                    </div>
                    <!-- Review button per item -->
                    <button
                      *ngIf="order.status === 'DELIVERED'"
                      [disabled]="reviewedProductIds.has(item.product.id)"
                      (click)="!reviewedProductIds.has(item.product.id) && toggleReviewForm(order.id, item.product.id)"
                      class="btn-review-toggle"
                      [class.active]="isFormOpen(order.id, item.product.id)"
                      [class.reviewed]="reviewedProductIds.has(item.product.id)"
                    >
                      <ng-container *ngIf="reviewedProductIds.has(item.product.id)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        Sharh qoldirildi
                      </ng-container>
                      <ng-container *ngIf="!reviewedProductIds.has(item.product.id)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                        {{ isFormOpen(order.id, item.product.id) ? 'Yopish' : 'Sharh qoldirish' }}
                      </ng-container>
                    </button>
                  </div>
                </div>

                <!-- Inline review form — slides open per item -->
                <div
                  *ngIf="order.status === 'DELIVERED' && isFormOpen(order.id, item.product.id)"
                  class="inline-review-panel"
                >
                  <!-- Success state -->
                  <div *ngIf="getReviewState(order.id, item.product.id) === 'success'" class="review-success">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    Sharhingiz muvaffaqiyatli yuborildi!
                  </div>

                  <!-- Error state -->
                  <div *ngIf="getReviewState(order.id, item.product.id) === 'error'" class="review-error">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    {{ getReviewError(order.id, item.product.id) }}
                  </div>

                  <!-- Form state -->
                  <ng-container *ngIf="getReviewState(order.id, item.product.id) !== 'success'">
                    <p class="review-panel-title">{{ item.product.name }} uchun sharh</p>

                    <!-- Star rating -->
                    <div class="star-row">
                      <span class="star-label">Baho:</span>
                      <span
                        *ngFor="let s of stars"
                        class="star-btn"
                        (click)="setRating(order.id, item.product.id, s)"
                        [class.lit]="getRating(order.id, item.product.id) >= s"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24"
                          [attr.fill]="getRating(order.id, item.product.id) >= s ? '#fbbf24' : 'none'"
                          [attr.stroke]="getRating(order.id, item.product.id) >= s ? '#fbbf24' : 'rgba(255,255,255,0.3)'"
                          stroke-width="1.5">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                      </span>
                    </div>

                    <!-- Textarea -->
                    <textarea
                      [(ngModel)]="getReviewDraft(order.id, item.product.id).comment"
                      placeholder="Fikr-mulohazalaringizni yozing..."
                      class="review-textarea"
                    ></textarea>

                    <!-- Submit -->
                    <div class="review-actions">
                      <button
                        class="btn-cancel"
                        (click)="toggleReviewForm(order.id, item.product.id)"
                      >Bekor qilish</button>
                      <button
                        class="btn-submit-review"
                        [disabled]="isSubmitting(order.id, item.product.id) || !getReviewDraft(order.id, item.product.id).comment.trim()"
                        (click)="submitReview(order.id, item.product.id)"
                      >
                        <span *ngIf="!isSubmitting(order.id, item.product.id)">Yuborish</span>
                        <span *ngIf="isSubmitting(order.id, item.product.id)">Yuborilmoqda...</span>
                      </button>
                    </div>
                  </ng-container>
                </div>

                <!-- Existing Review & Admin Reply Display -->
                <div
                  *ngIf="reviewedProductIds.has(item.product.id) && myReviews[item.product.id]"
                  class="existing-review-panel"
                >
                  <div class="user-review-bubble">
                    <div class="review-meta">
                      <div class="stars-display">
                        <span *ngFor="let s of stars" [class.filled]="myReviews[item.product.id].rating >= s">★</span>
                      </div>
                      <span class="review-date">{{ myReviews[item.product.id].createdAt | date:'dd.MM.yyyy HH:mm' }}</span>
                    </div>
                    <div class="review-text">
                      <strong>Sizning sharhingiz:</strong> {{ myReviews[item.product.id].comment }}
                    </div>
                  </div>

                  <!-- Admin reply -->
                  <div *ngIf="myReviews[item.product.id].replyText" class="admin-reply-box">
                    <div class="reply-header">
                      <div class="admin-avatar">
                        <img *ngIf="myReviews[item.product.id].replier?.profilePicture" [src]="myReviews[item.product.id].replier.profilePicture" class="admin-avatar-img" />
                        <svg *ngIf="!myReviews[item.product.id].replier?.profilePicture" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                      </div>
                      <div>
                        <span class="admin-name">{{ myReviews[item.product.id].replier?.firstName || myReviews[item.product.id].replier?.username || 'Admin' }}</span>
                        <span class="badge-admin">Admin</span>
                        <span class="reply-date" *ngIf="myReviews[item.product.id].replyCreatedAt">
                          {{ myReviews[item.product.id].replyCreatedAt | date:'dd.MM.yyyy HH:mm' }}
                        </span>
                      </div>
                    </div>
                    <div class="reply-content">
                      <p>{{ myReviews[item.product.id].replyText }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Total price footer -->
          <div class="order-footer">
            <span class="total-label">Jami to'lov summasi:</span>
            <span class="total-val">{{ order.totalAmount | number:'1.0-0' }} so'm</span>
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
      gap: 0.75rem;
      margin-bottom: 1.5rem;
    }

    .item-wrapper {
      display: flex;
      flex-direction: column;
      border-radius: 10px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.65rem 1rem;
      background: rgba(255, 255, 255, 0.02);
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

    .item-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.4rem;
      flex-shrink: 0;
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

    /* Inline review toggle button */
    .btn-review-toggle {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      padding: 0.3rem 0.75rem;
      font-size: 0.78rem;
      font-weight: 600;
      border-radius: 20px;
      border: 1px solid rgba(0, 242, 254, 0.3);
      background: rgba(0, 242, 254, 0.06);
      color: var(--primary-color);
      cursor: pointer;
      transition: all 0.25s ease;
      white-space: nowrap;
    }

    .btn-review-toggle:hover {
      background: rgba(0, 242, 254, 0.14);
      border-color: var(--primary-color);
      transform: translateY(-1px);
    }

    .btn-review-toggle.active {
      background: rgba(0, 242, 254, 0.12);
      border-color: var(--primary-color);
    }

    .btn-review-toggle.reviewed {
      background: rgba(52, 211, 153, 0.08) !important;
      border-color: rgba(52, 211, 153, 0.3) !important;
      color: #34d399 !important;
      cursor: default !important;
      pointer-events: none;
      transform: none !important;
      box-shadow: none !important;
    }

    /* Inline review panel */
    .inline-review-panel {
      padding: 1.25rem 1.25rem 1rem;
      background: rgba(0, 0, 0, 0.25);
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-8px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .review-panel-title {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 1rem;
    }

    /* Stars */
    .star-row {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      margin-bottom: 0.85rem;
    }

    .star-label {
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin-right: 0.25rem;
    }

    .star-btn {
      cursor: pointer;
      transition: transform 0.18s ease;
      display: flex;
      align-items: center;
    }

    .star-btn:hover,
    .star-btn.lit {
      transform: scale(1.2);
    }

    /* Textarea */
    .review-textarea {
      width: 100%;
      min-height: 80px;
      padding: 0.75rem 1rem;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--glass-border);
      color: var(--text-primary);
      font-size: 0.9rem;
      font-family: inherit;
      resize: vertical;
      outline: none;
      transition: border-color 0.2s;
      box-sizing: border-box;
      margin-bottom: 0.85rem;
    }

    .review-textarea:focus {
      border-color: var(--primary-color);
    }

    /* Actions row */
    .review-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
    }

    .btn-cancel {
      padding: 0.45rem 1.1rem;
      font-size: 0.85rem;
      font-weight: 600;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: transparent;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-cancel:hover {
      background: rgba(255, 255, 255, 0.06);
      color: var(--text-primary);
    }

    .btn-submit-review {
      padding: 0.45rem 1.4rem;
      font-size: 0.85rem;
      font-weight: 700;
      border-radius: 8px;
      border: none;
      background: var(--primary-gradient);
      color: #0b0e14;
      cursor: pointer;
      transition: all 0.2s;
      font-family: var(--font-heading);
    }

    .btn-submit-review:hover:not(:disabled) {
      opacity: 0.88;
      transform: translateY(-1px);
    }

    .btn-submit-review:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    /* Success / Error states */
    .review-success {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      color: #34d399;
      font-size: 0.9rem;
      font-weight: 600;
      padding: 0.5rem 0;
    }

    .review-error {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #f87171;
      font-size: 0.85rem;
      font-weight: 600;
      background: rgba(239,68,68,0.08);
      border: 1px solid rgba(239,68,68,0.2);
      border-radius: 8px;
      padding: 0.6rem 0.85rem;
      margin-bottom: 0.75rem;
    }

    /* Existing Review & Admin Reply Styling */
    .existing-review-panel {
      padding: 1.25rem;
      background: rgba(0, 0, 0, 0.15);
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .user-review-bubble {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .review-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .review-date {
      color: var(--text-secondary);
      font-size: 0.75rem;
    }

    .review-text {
      font-size: 0.92rem;
      color: var(--text-primary);
      line-height: 1.45;
    }

    .stars-display {
      color: #fbbf24;
      font-size: 0.95rem;
      display: inline-flex;
      gap: 1px;
    }

    .stars-display span {
      opacity: 0.22;
    }

    .stars-display span.filled {
      opacity: 1;
    }

    /* Admin reply block */
    .admin-reply-box {
      padding: 1rem;
      border-radius: 8px;
      background: rgba(168, 85, 247, 0.05);
      border-left: 3px solid #a855f7;
      text-align: left;
    }

    /* Dark mode override */
    :host-context([data-theme="dark"]) .admin-reply-box {
      background: rgba(0, 242, 254, 0.05);
      border-left: 3px solid #00f2fe;
    }

    .reply-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 0.5rem;
    }

    .admin-avatar {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
      overflow: hidden;
      flex-shrink: 0;
    }

    .admin-avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .admin-name {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-right: 6px;
    }

    .badge-admin {
      background: rgba(168, 85, 247, 0.15);
      color: #c084fc;
      font-size: 0.65rem;
      font-weight: 700;
      padding: 1px 6px;
      border-radius: 50px;
      text-transform: uppercase;
      margin-right: 8px;
      letter-spacing: 0.02em;
    }

    :host-context([data-theme="dark"]) .badge-admin {
      background: rgba(0, 242, 254, 0.15);
      color: #00f2fe;
    }

    .reply-date {
      color: var(--text-secondary);
      font-size: 0.72rem;
    }

    .reply-content {
      font-size: 0.9rem;
      color: var(--text-secondary);
      line-height: 1.4;
    }

    .reply-content p {
      margin: 0;
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
  stars = [1, 2, 3, 4, 5];
  reviewedProductIds: Set<number> = new Set<number>();
  myReviews: Record<number, any> = {};

  // Tracks which (orderId-productId) forms are open
  private openForms = new Set<string>();

  // Per-item review draft: { comment, rating }
  private drafts: Record<string, { comment: string; rating: number }> = {};

  // Per-item submission state: 'idle' | 'submitting' | 'success' | 'error'
  private states: Record<string, string> = {};
  private errors: Record<string, string> = {};

  constructor(
    private orderService: OrderService,
    private reviewService: ReviewService
  ) {}

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

    this.reviewService.getReviewedProductIds().subscribe({
      next: (ids) => {
        this.reviewedProductIds = new Set(ids);
      },
      error: () => {}
    });

    this.reviewService.getMyReviews().subscribe({
      next: (reviews) => {
        reviews.forEach(r => {
          if (r.product && r.product.id) {
            this.myReviews[r.product.id] = r;
          }
        });
      },
      error: () => {}
    });
  }

  private key(orderId: number, productId: number): string {
    return `${orderId}-${productId}`;
  }

  isFormOpen(orderId: number, productId: number): boolean {
    return this.openForms.has(this.key(orderId, productId));
  }

  toggleReviewForm(orderId: number, productId: number): void {
    const k = this.key(orderId, productId);
    if (this.openForms.has(k)) {
      this.openForms.delete(k);
    } else {
      this.openForms.add(k);
      // initialise draft if needed
      if (!this.drafts[k]) {
        this.drafts[k] = { comment: '', rating: 5 };
      }
      this.states[k] = 'idle';
    }
  }

  getReviewDraft(orderId: number, productId: number): { comment: string; rating: number } {
    const k = this.key(orderId, productId);
    if (!this.drafts[k]) {
      this.drafts[k] = { comment: '', rating: 5 };
    }
    return this.drafts[k];
  }

  getRating(orderId: number, productId: number): number {
    return this.getReviewDraft(orderId, productId).rating;
  }

  setRating(orderId: number, productId: number, value: number): void {
    this.getReviewDraft(orderId, productId).rating = value;
  }

  getReviewState(orderId: number, productId: number): string {
    return this.states[this.key(orderId, productId)] ?? 'idle';
  }

  getReviewError(orderId: number, productId: number): string {
    return this.errors[this.key(orderId, productId)] ?? '';
  }

  isSubmitting(orderId: number, productId: number): boolean {
    return this.states[this.key(orderId, productId)] === 'submitting';
  }

  submitReview(orderId: number, productId: number): void {
    const k = this.key(orderId, productId);
    const draft = this.drafts[k];
    if (!draft || !draft.comment.trim()) return;

    this.states[k] = 'submitting';

    this.reviewService.addReview(productId, draft.comment, draft.rating).subscribe({
      next: (savedReview) => {
        this.states[k] = 'success';
        this.reviewedProductIds.add(productId);
        this.myReviews[productId] = savedReview;
        // auto-close form after 2s
        setTimeout(() => {
          this.openForms.delete(k);
        }, 2000);
      },
      error: (err) => {
        this.states[k] = 'error';
        this.errors[k] = err.error?.message || 'Xatolik yuz berdi. Qayta urinib ko\'ring.';
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
