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
      <!-- Back button -->
      <a routerLink="/" class="btn-back">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        Katalogga qaytish
      </a>

      <!-- Detail Grid -->
      <div class="detail-grid">
        <!-- Product Image -->
        <div class="image-wrapper glass-panel">
          <img [src]="product.imageUrl" [alt]="product.name" class="detail-image" />
        </div>

        <!-- Product Specs Info -->
        <div class="info-wrapper glass-panel">
          <span class="category-tag">{{ product.category?.name }}</span>
          <h1 class="product-title">{{ product.name }}</h1>
          
          <div class="price-box">
            <span class="price-label">Narxi:</span>
            <span class="price-value">\${{ product.price | number:'1.2-2' }}</span>
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
              <span *ngIf="!isAdding">Savatga qo'shish (\${{ product.price * quantity | number:'1.2-2' }})</span>
              <span *ngIf="isAdding">Qo'shilmoqda...</span>
            </button>
          </div>
          
          <div class="not-available-message" *ngIf="product.stockQuantity === 0">
            Ushbu mahsulot vaqtincha tugagan. Tez orada qayta sotuvga chiqariladi.
          </div>
        </div>
      </div>
    </div>

    <!-- Loading screen -->
    <div class="loading-container" *ngIf="isLoading">
      <div class="spinner"></div>
      <p>Mahsulot tafsilotlari yuklanmoqda...</p>
    </div>
  `,
  styles: [`
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
      margin-bottom: 2rem;
      transition: var(--transition-smooth);
    }

    .btn-back:hover {
      color: var(--primary-color);
      transform: translateX(-3px);
    }

    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
    }

    .image-wrapper {
      padding: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 400px;
      background: rgba(255, 255, 255, 0.01);
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
      .detail-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      .info-wrapper {
        padding: 2rem;
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: any = null;
  quantity = 1;
  isLoading = true;
  isAdding = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(+id);
    } else {
      this.router.navigate(['/']);
    }
  }

  loadProduct(id: number): void {
    this.isLoading = true;
    this.productService.getProductById(id).subscribe({
      next: (prod) => {
        this.product = prod;
        this.isLoading = false;
      },
      error: () => {
        this.router.navigate(['/']);
        this.isLoading = false;
      }
    });
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
      alert('Savatga mahsulot qo\'shish uchun avval tizimga kiring!');
      this.router.navigate(['/login'], { queryParams: { returnUrl: `/product/${this.product.id}` } });
      return;
    }

    this.isAdding = true;
    this.cartService.addToCart(this.product.id, this.quantity).subscribe({
      next: () => {
        this.isAdding = false;
        alert(`Savatga ${this.quantity} ta mahsulot qo'shildi!`);
        this.quantity = 1;
      },
      error: (err) => {
        this.isAdding = false;
        alert(err.error?.message || 'Xatolik yuz berdi!');
      }
    });
  }
}
