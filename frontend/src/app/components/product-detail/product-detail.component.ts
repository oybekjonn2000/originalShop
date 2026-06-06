import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="detail-container fade-in-el" *ngIf="product">
      <!-- Header with Back & Edit buttons -->
      <div class="detail-header">
        <a routerLink="/" class="btn-back">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Katalogga qaytish
        </a>
        <a *ngIf="isAdmin" [routerLink]="['/admin/products']" class="btn-edit-admin">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          Tahrirlash (Admin)
        </a>
      </div>

      <!-- Detail Grid -->
      <div class="detail-grid">
        <!-- Product Image Gallery -->
        <div class="gallery-wrapper">
          <div class="image-wrapper glass-panel">
            <img [src]="getProductImages(product)[activeImageIndex]" [alt]="product.name" class="detail-image" />
            
            <!-- Gallery Arrows -->
            <button class="gallery-arrow prev" *ngIf="getProductImages(product).length > 1" (click)="prevImage()">❮</button>
            <button class="gallery-arrow next" *ngIf="getProductImages(product).length > 1" (click)="nextImage()">❯</button>
          </div>
          
          <!-- Thumbnails -->
          <div class="thumbnails-container" *ngIf="getProductImages(product).length > 1">
            <div 
              *ngFor="let img of getProductImages(product); let idx = index"
              class="thumbnail-item glass-panel"
              [class.active]="activeImageIndex === idx"
              (click)="activeImageIndex = idx"
            >
              <img [src]="img" [alt]="product.name" />
            </div>
          </div>
        </div>

        <!-- Product Specs Info -->
        <div class="info-wrapper glass-panel">
          <span class="category-tag">{{ product.category?.name }}</span>
          <h1 class="product-title">{{ product.name }}</h1>
          
          <div class="price-box">
            <span class="price-label">Narxi:</span>
            <span class="price-value">{{ product.price | number:'1.0-0' }} so'm</span>
          </div>

          <div class="installments-box">
            <div class="installment-option">
              <div class="installment-amount">{{ calculateInstallment(product.price, 6) | number:'1.0-0' }} so'm</div>
              <div class="installment-period">x 6 oy</div>
            </div>
            <div class="installment-option">
              <div class="installment-amount">{{ calculateInstallment(product.price, 12) | number:'1.0-0' }} so'm</div>
              <div class="installment-period">x 12 oy</div>
            </div>
          </div>

          <div class="stock-status" [class.low]="product.stockQuantity <= 5">
            Omborda: 
            <strong *ngIf="product.stockQuantity > 0">{{ product.stockQuantity }} ta bor</strong>
            <strong *ngIf="product.stockQuantity === 0" class="out">Tugagan</strong>
          </div>

          <p class="product-description">{{ product.description }}</p>

          <!-- Add section -->
          <div class="purchase-actions" *ngIf="product.stockQuantity > 0">
            <div class="qty-selector">
              <button (click)="decrementQty()" class="qty-btn" [disabled]="quantity <= 1">-</button>
              <input type="number" [(ngModel)]="quantity" min="1" [max]="product.stockQuantity" class="glass-input qty-input" readonly />
              <button (click)="incrementQty()" class="qty-btn" [disabled]="quantity >= product.stockQuantity">+</button>
            </div>

            <button (click)="addToCart()" [disabled]="isAdding" class="btn-primary flex-1">
              <span *ngIf="!isAdding">Savatga qo'shish ({{ product.price * quantity | number:'1.0-0' }} so'm)</span>
              <span *ngIf="isAdding">Qo'shilmoqda...</span>
            </button>
          </div>
          
          <div class="not-available-message" *ngIf="product.stockQuantity === 0">
            Ushbu mahsulot vaqtincha tugagan. Tez orada qayta sotuvga chiqariladi.
          </div>
        </div>
      </div>

      <!-- Detailed Description Section -->
      <div class="full-description-section glass-panel fade-in-el" *ngIf="product.fullDescription">
        <h2 class="description-section-title">Mahsulotning umumiy tavsifi</h2>
        <div class="full-description-content" [innerHTML]="product.fullDescription" style="white-space: pre-wrap;"></div>
      </div>

      <!-- Shunga o'xshash mahsulotlar bo'limi -->
      <div class="recommendations-section fade-in-el" *ngIf="similarProducts.length > 0">
        <h2 class="section-title">Shunga o'xshash mahsulotlar</h2>
        <div class="products-mini-grid">
          <div *ngFor="let prod of similarProducts" class="mini-product-card glass-card" [routerLink]="['/product', prod.id]">
            <div class="mini-img-wrapper">
              <img [src]="prod.imageUrl" [alt]="prod.name" />
              <span *ngIf="prod.discount" class="discount-badge-mini">-{{ prod.discount }}%</span>
            </div>
            <div class="mini-info">
              <h3 class="mini-name">{{ prod.name }}</h3>
              <div class="mini-price-row">
                <span class="mini-price">{{ prod.price | number:'1.0-0' }} so'm</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Yaqin ko'rilgan mahsulotlar bo'limi -->
      <div class="recommendations-section fade-in-el" *ngIf="recentlyViewedProducts.length > 0">
        <h2 class="section-title">Yaqin ko'rilgan mahsulotlar</h2>
        <div class="products-mini-grid">
          <div *ngFor="let prod of recentlyViewedProducts" class="mini-product-card glass-card" [routerLink]="['/product', prod.id]">
            <div class="mini-img-wrapper">
              <img [src]="prod.imageUrl" [alt]="prod.name" />
              <span *ngIf="prod.discount" class="discount-badge-mini">-{{ prod.discount }}%</span>
            </div>
            <div class="mini-info">
              <h3 class="mini-name">{{ prod.name }}</h3>
              <div class="mini-price-row">
                <span class="mini-price">{{ prod.price | number:'1.0-0' }} so'm</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading screen -->
    <div class="loading-container" *ngIf="isLoading">
      <div class="spinner"></div>
      <p>Mahsulot tafsilotlari yuklanmoqda...</p>
    </div>

    <!-- Material Snackbar Toast -->
    <div class="mat-snackbar" [ngClass]="toastType" *ngIf="showToastNotif">
      <div class="mat-snack-icon">
        <svg *ngIf="toastType === 'snack-success'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <svg *ngIf="toastType === 'snack-error'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <svg *ngIf="toastType === 'snack-warning'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
      </div>
      <span class="mat-snack-text">{{ toastMsg }}</span>
    </div>
  `,
  styles: [`
    .full-description-section {
      margin-top: 3rem;
      padding: 3rem;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.01) 0%, rgba(255, 255, 255, 0.02) 100%);
      border: 1px solid var(--glass-border);
      border-radius: var(--border-radius-lg);
    }

    .description-section-title {
      font-size: 1.8rem;
      font-weight: 800;
      margin-bottom: 1.5rem;
      color: var(--text-primary);
      border-left: 4px solid var(--primary-color);
      padding-left: 1rem;
      line-height: 1.2;
    }

    .full-description-content {
      color: var(--text-secondary);
      font-size: 1.05rem;
      line-height: 1.8;
      letter-spacing: 0.01em;
    }

    .detail-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .btn-back {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--text-secondary);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.95rem;
      transition: var(--transition-smooth);
    }

    .btn-back:hover {
      color: var(--primary-color);
      transform: translateX(-3px);
    }

    .detail-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      width: 100%;
    }

    .btn-edit-admin {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: rgba(247, 107, 28, 0.1);
      border: 1px solid rgba(247, 107, 28, 0.25);
      color: #f76b1c;
      font-weight: 600;
      font-size: 0.9rem;
      text-decoration: none;
      border-radius: 10px;
      transition: var(--transition-smooth);
      backdrop-filter: blur(10px);
    }

    .btn-edit-admin:hover {
      background: rgba(247, 107, 28, 0.2);
      border-color: rgba(247, 107, 28, 0.5);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(247, 107, 28, 0.2);
    }

    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
    }

    .image-wrapper {
      position: relative;
      padding: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      background: rgba(255, 255, 255, 0.01);
      width: 100%;
    }

    .gallery-wrapper {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 100%;
    }

    .gallery-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(11, 14, 20, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: var(--text-primary);
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 1.1rem;
      transition: var(--transition-smooth);
      z-index: 5;
      backdrop-filter: blur(8px);
      padding: 0;
      line-height: 1;
    }

    .gallery-arrow:hover {
      background: var(--primary-color);
      color: #0b0e14;
      box-shadow: 0 0 15px var(--primary-glow);
      border-color: var(--primary-color);
    }

    .gallery-arrow.prev {
      left: 1rem;
    }

    .gallery-arrow.next {
      right: 1rem;
    }

    .thumbnails-container {
      display: flex;
      gap: 0.75rem;
      overflow-x: auto;
      padding-bottom: 0.5rem;
      scrollbar-width: none;
    }

    .thumbnails-container::-webkit-scrollbar {
      display: none;
    }

    .thumbnail-item {
      width: 70px;
      height: 70px;
      min-width: 70px;
      border-radius: var(--border-radius-sm);
      overflow: hidden;
      cursor: pointer;
      padding: 0.25rem;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--glass-border);
      transition: var(--transition-smooth);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .thumbnail-item img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .thumbnail-item:hover, .thumbnail-item.active {
      border-color: var(--primary-color);
      background: rgba(0, 242, 254, 0.05);
      transform: translateY(-2px);
    }

    .detail-image {
      width: 100%;
      max-height: 450px;
      object-fit: contain;
      border-radius: var(--border-radius-md);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
    }

    .info-wrapper {
      padding: 3rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .category-tag {
      display: inline-block;
      align-self: flex-start;
      padding: 0.25rem 0.75rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--glass-border);
      border-radius: 50px;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
      letter-spacing: 0.03em;
    }

    .product-title {
      font-size: 2.5rem;
      line-height: 1.2;
      margin-bottom: 1.5rem;
      font-weight: 800;
    }

    .price-box {
      display: flex;
      align-items: baseline;
      gap: 0.75rem;
      margin-bottom: 1.25rem;
    }

    .price-label {
      color: var(--text-secondary);
      font-size: 1rem;
      font-weight: 500;
    }

    .price-value {
      font-size: 2rem;
      font-weight: 800;
      background: var(--primary-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-family: var(--font-heading);
    }

    .installments-box {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .installment-option {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: var(--border-radius-sm);
      padding: 0.75rem 1rem;
      flex: 1;
      text-align: center;
      transition: var(--transition-smooth);
    }

    .installment-option:hover {
      background: rgba(0, 242, 254, 0.05);
      border-color: rgba(0, 242, 254, 0.3);
      transform: translateY(-2px);
    }

    .installment-amount {
      color: #fbbf24;
      font-size: 1.15rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
    }

    .installment-period {
      color: var(--text-secondary);
      font-size: 0.85rem;
    }

    .stock-status {
      font-size: 0.95rem;
      color: var(--text-secondary);
      margin-bottom: 1.75rem;
    }

    .stock-status strong {
      color: var(--success-color);
    }

    .stock-status.low strong {
      color: var(--warning-color);
    }

    .stock-status strong.out {
      color: var(--danger-color);
    }

    .product-description {
      color: var(--text-secondary);
      font-size: 1rem;
      line-height: 1.7;
      margin-bottom: 2.5rem;
    }

    .purchase-actions {
      display: flex;
      gap: 1.5rem;
      align-items: center;
    }

    .qty-selector {
      display: flex;
      align-items: center;
      border: 1px solid var(--glass-border);
      border-radius: var(--border-radius-sm);
      overflow: hidden;
      background: rgba(255, 255, 255, 0.03);
    }

    .qty-btn {
      background: none;
      border: none;
      color: var(--text-primary);
      width: 40px;
      height: 42px;
      font-size: 1.2rem;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition-smooth);
    }

    .qty-btn:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.06);
      color: var(--primary-color);
    }

    .qty-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .qty-input {
      width: 50px;
      border: none;
      background: none;
      text-align: center;
      padding: 0;
      height: 42px;
      font-weight: 700;
    }

    .flex-1 {
      flex: 1;
    }

    .not-available-message {
      padding: 1rem;
      border-radius: var(--border-radius-sm);
      background: rgba(239, 68, 68, 0.08);
      border: 1px solid rgba(239, 68, 68, 0.2);
      color: #f87171;
      font-size: 0.95rem;
      font-weight: 500;
      text-align: center;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 10rem 0;
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

    @media (max-width: 900px) {
      .detail-grid { grid-template-columns: 1fr; gap: 1.5rem; }
      .info-wrapper { padding: 2rem; }
      .product-title { font-size: 1.8rem; }
      .installments-box { flex-direction: row; }
    }

    @media (max-width: 768px) {
      .detail-container { padding: 0 0.75rem; }
      .image-wrapper { min-height: 260px; padding: 1.25rem; }
      .detail-image { max-height: 280px; }
      .product-title { font-size: 1.5rem; }
      .price-value { font-size: 1.6rem; }
      .installments-box { gap: 0.75rem; }
      .installment-amount { font-size: 1rem; }
      .purchase-actions { flex-direction: column; }
      .flex-1 { width: 100%; }
      .full-description-section { padding: 1.5rem; margin-top: 2rem; }
      .description-section-title { font-size: 1.4rem; }
    }

    @media (max-width: 480px) {
      .info-wrapper { padding: 1.25rem; }
      .product-title { font-size: 1.25rem; }
      .installments-box { flex-direction: column; }
      .installment-option { flex-direction: row; justify-content: space-between; align-items: center; }
      .price-value { font-size: 1.4rem; }
    }

    .recommendations-section {
      margin-top: 3rem;
      margin-bottom: 2rem;
    }

    .section-title {
      font-size: 1.8rem;
      font-weight: 800;
      margin-bottom: 1.5rem;
      color: var(--text-primary);
      border-left: 4px solid var(--secondary-color);
      padding-left: 1rem;
      line-height: 1.2;
    }

    .products-mini-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      margin-top: 1rem;
    }

    .mini-product-card {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      padding: 1rem;
      border-radius: var(--border-radius-md);
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--glass-border);
      transition: var(--transition-smooth);
      height: 100%;
    }

    .mini-product-card:hover {
      transform: translateY(-5px);
      border-color: var(--glass-border-focus);
      box-shadow: 0 10px 20px 0 var(--primary-glow);
    }

    .mini-img-wrapper {
      position: relative;
      width: 100%;
      padding-bottom: 100%; /* 1:1 Aspect Ratio */
      margin-bottom: 0.75rem;
      background: rgba(255, 255, 255, 0.01);
      border-radius: var(--border-radius-sm);
      overflow: hidden;
    }

    .mini-img-wrapper img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 0.5rem;
    }

    .discount-badge-mini {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: var(--secondary-gradient);
      color: white;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.2rem 0.5rem;
      border-radius: 50px;
      box-shadow: 0 4px 10px rgba(255, 15, 123, 0.3);
    }

    .mini-info {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }

    .mini-name {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      height: 2.7rem;
      line-height: 1.35;
    }

    .mini-price-row {
      margin-top: auto;
    }

    .mini-price {
      font-size: 1.1rem;
      font-weight: 800;
      color: var(--primary-color);
      font-family: var(--font-heading);
    }

    @media (max-width: 900px) {
      .products-mini-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
      }
    }

    @media (max-width: 480px) {
      .products-mini-grid {
        grid-template-columns: 1fr;
      }
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
    .snack-warning { background: rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.4); color: #fbbf24; }
    .mat-snack-icon { display: flex; align-items: center; flex-shrink: 0; }
    .mat-snack-text { flex: 1; line-height: 1.4; }
    @keyframes snackSlideUp {
      from { opacity: 0; transform: translateX(-50%) translateY(20px); }
      to   { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: any = null;
  quantity = 1;
  isLoading = true;
  isAdding = false;
  similarProducts: any[] = [];
  recentlyViewedProducts: any[] = [];
  activeImageIndex = 0;

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  // Toast
  showToastNotif = false;
  toastMsg = '';
  toastType: 'snack-success' | 'snack-error' | 'snack-warning' = 'snack-success';
  private toastTimer: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadProduct(+id);
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  loadProduct(id: number): void {
    this.isLoading = true;
    this.activeImageIndex = 0;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.productService.getProductById(id).subscribe({
      next: (prod) => {
        this.product = prod;
        this.isLoading = false;
        this.loadSimilarProducts(prod);
        this.addToRecentlyViewed(prod);
        this.loadRecentlyViewedProducts(prod.id);
      },
      error: () => {
        this.router.navigate(['/']);
        this.isLoading = false;
      }
    });
  }

  loadSimilarProducts(currentProduct: any): void {
    if (currentProduct.category && currentProduct.category.id) {
      this.productService.getProductsByCategory(currentProduct.category.id).subscribe({
        next: (products) => {
          this.similarProducts = products
            .filter(p => p.id !== currentProduct.id)
            .slice(0, 4);
        },
        error: () => {
          this.similarProducts = [];
        }
      });
    } else {
      this.similarProducts = [];
    }
  }

  private getRecentlyViewedStorageKey(): string {
    const user = this.authService.currentUserValue;
    if (user) {
      const prefix = user.role === 'ROLE_ADMIN' ? 'admin' : 'user';
      const id = user.id || user.username || 'unknown';
      return `recentlyViewed_${prefix}_${id}`;
    }
    return 'recentlyViewed_guest';
  }

  addToRecentlyViewed(currentProduct: any): void {
    try {
      const key = this.getRecentlyViewedStorageKey();
      const viewedStr = localStorage.getItem(key);
      let viewed: any[] = viewedStr ? JSON.parse(viewedStr) : [];
      
      // Remove current product if already in list to move it to the top
      viewed = viewed.filter(p => p.id !== currentProduct.id);
      
      // Add current product to the beginning
      viewed.unshift({
        id: currentProduct.id,
        name: currentProduct.name,
        imageUrl: currentProduct.imageUrl,
        price: currentProduct.price,
        discount: currentProduct.discount,
        category: currentProduct.category,
        stockQuantity: currentProduct.stockQuantity
      });
      
      // Limit to 10 items
      if (viewed.length > 10) {
        viewed = viewed.slice(0, 10);
      }
      
      localStorage.setItem(key, JSON.stringify(viewed));
    } catch (e) {
      console.error('Error saving to recently viewed', e);
    }
  }

  loadRecentlyViewedProducts(currentProductId: number): void {
    try {
      const key = this.getRecentlyViewedStorageKey();
      const viewedStr = localStorage.getItem(key);
      if (viewedStr) {
        const viewed = JSON.parse(viewedStr);
        this.recentlyViewedProducts = viewed
          .filter((p: any) => p.id !== currentProductId)
          .slice(0, 4);
      } else {
        this.recentlyViewedProducts = [];
      }
    } catch (e) {
      this.recentlyViewedProducts = [];
    }
  }

  getProductImages(product: any): string[] {
    const list: string[] = [];
    if (product.imageUrl) list.push(product.imageUrl);
    if (product.imageUrls && product.imageUrls.length > 0) {
      product.imageUrls.forEach((url: string) => {
        if (url && !list.includes(url)) {
          list.push(url);
        }
      });
    }
    return list;
  }

  prevImage(): void {
    const imgs = this.getProductImages(this.product);
    if (imgs.length <= 1) return;
    this.activeImageIndex = (this.activeImageIndex - 1 + imgs.length) % imgs.length;
  }

  nextImage(): void {
    const imgs = this.getProductImages(this.product);
    if (imgs.length <= 1) return;
    this.activeImageIndex = (this.activeImageIndex + 1) % imgs.length;
  }

  incrementQty(): void {
    if (this.quantity < this.product.stockQuantity) {
      this.quantity++;
    }
  }

  decrementQty(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (!this.authService.isLoggedIn()) {
      this.showToast('Savatga mahsulot qo\'shish uchun avval tizimga kiring!', 'snack-warning');
      this.router.navigate(['/login'], { queryParams: { returnUrl: `/product/${this.product.id}` } });
      return;
    }

    this.isAdding = true;
    this.cartService.addToCart(this.product.id, this.quantity).subscribe({
      next: () => {
        this.isAdding = false;
        this.showToast(`Savatga ${this.quantity} ta mahsulot qo'shildi!`, 'snack-success');
        this.quantity = 1;
      },
      error: (err) => {
        this.isAdding = false;
        this.showToast(err.error?.message || 'Xatolik yuz berdi!', 'snack-error');
      }
    });
  }

  calculateInstallment(price: number, months: number): number {
    const totalInterestRate = (45 / 12) * months;
    const totalAmount = price * (1 + (totalInterestRate / 100));
    return totalAmount / months;
  }

  showToast(message: string, type: 'snack-success' | 'snack-error' | 'snack-warning' = 'snack-success'): void {
    clearTimeout(this.toastTimer);
    this.toastMsg = message;
    this.toastType = type;
    this.showToastNotif = true;
    this.toastTimer = setTimeout(() => this.showToastNotif = false, 3500);
  }
}
