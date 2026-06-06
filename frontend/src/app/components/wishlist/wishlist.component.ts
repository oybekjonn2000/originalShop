import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="wishlist-page">
      <div class="page-header">
        <div class="header-content">
          <div class="header-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <div>
            <h1>Sevimlilar</h1>
            <p class="header-subtitle">{{ wishlistItems.length }} ta mahsulot saqlangan</p>
          </div>
        </div>
        <button *ngIf="wishlistItems.length > 0" class="btn-clear" (click)="clearWishlist()">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
          </svg>
          Barchasini o'chirish
        </button>
      </div>

      <!-- Empty State -->
      <div *ngIf="wishlistItems.length === 0" class="empty-state">
        <div class="empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </div>
        <h2>Sevimlilar bo'sh</h2>
        <p>Yoqtirgan mahsulotlaringizni yurakcha belgisi orqali saqlang</p>
        <a routerLink="/" class="btn-primary">Mahsulotlarni ko'rish</a>
      </div>

      <!-- Wishlist Grid -->
      <div *ngIf="wishlistItems.length > 0" class="wishlist-grid">
        <div *ngFor="let item of wishlistItems" class="wishlist-card glass-panel">
          <div class="card-image" (click)="goToProduct(item.product.id)">
            <img 
              [src]="getProductImage(item.product)" 
              [alt]="item.product.name"
              (error)="onImageError($event)"
            />
            <div class="card-overlay">
              <span>Ko'rish</span>
            </div>
          </div>

          <div class="card-body">
            <div class="product-brand" *ngIf="item.product.brand">{{ item.product.brand.name }}</div>
            <h3 class="product-name" (click)="goToProduct(item.product.id)">{{ item.product.name }}</h3>

            <div class="product-price">
              <span class="price-current">{{ formatPrice(item.product.price) }} so'm</span>
            </div>

            <div class="product-stock">
              <span [class]="item.product.stockQuantity > 0 ? 'in-stock' : 'out-stock'">
                {{ item.product.stockQuantity > 0 ? 'Mavjud' : 'Tugagan' }}
              </span>
            </div>

            <div class="card-actions">
              <button 
                class="btn-cart" 
                (click)="addToCart(item)"
                [disabled]="item.product.stockQuantity === 0 || addingToCart[item.id]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                {{ addingToCart[item.id] ? "Qo'shilmoqda..." : "Savatga" }}
              </button>
              <button class="btn-remove" (click)="removeFromWishlist(item)" title="O'chirish">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .wishlist-page {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem 3rem;
    }

    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .header-icon {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      background: linear-gradient(135deg, rgba(255, 15, 123, 0.2), rgba(255, 80, 80, 0.1));
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ff4d6d;
    }

    h1 {
      font-family: var(--font-heading);
      font-size: 1.8rem;
      font-weight: 800;
      color: var(--text-primary);
      margin: 0 0 0.2rem;
    }

    .header-subtitle {
      color: var(--text-secondary);
      font-size: 0.9rem;
      margin: 0;
    }

    .btn-clear {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: rgba(255, 59, 59, 0.1);
      border: 1px solid rgba(255, 59, 59, 0.25);
      border-radius: 10px;
      color: #ff4d4d;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-clear:hover {
      background: rgba(255, 59, 59, 0.2);
      border-color: rgba(255, 59, 59, 0.5);
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 5rem 2rem;
    }

    .empty-icon {
      color: rgba(255, 77, 109, 0.3);
      margin-bottom: 1.5rem;
    }

    .empty-state h2 {
      font-family: var(--font-heading);
      font-size: 1.5rem;
      color: var(--text-primary);
      margin-bottom: 0.75rem;
    }

    .empty-state p {
      color: var(--text-secondary);
      margin-bottom: 2rem;
    }

    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 2rem;
      background: var(--primary-gradient);
      color: #04080f;
      font-family: var(--font-heading);
      font-weight: 700;
      font-size: 0.95rem;
      border-radius: 12px;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .btn-primary:hover {
      filter: brightness(1.1);
      transform: translateY(-2px);
    }

    /* Wishlist Grid */
    .wishlist-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 1.5rem;
    }

    .wishlist-card {
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .wishlist-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }

    .card-image {
      position: relative;
      aspect-ratio: 4/3;
      overflow: hidden;
      cursor: pointer;
      background: rgba(255,255,255,0.03);
    }

    .card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    .wishlist-card:hover .card-image img {
      transform: scale(1.05);
    }

    .card-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .card-overlay span {
      color: white;
      font-weight: 600;
      font-size: 0.95rem;
      background: rgba(0, 242, 254, 0.2);
      padding: 0.4rem 1.2rem;
      border-radius: 50px;
      border: 1px solid rgba(0, 242, 254, 0.4);
    }

    .wishlist-card:hover .card-overlay { opacity: 1; }

    .card-body {
      padding: 1rem;
    }

    .product-brand {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--primary-color);
      margin-bottom: 0.3rem;
    }

    .product-name {
      font-family: var(--font-heading);
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 0.75rem;
      cursor: pointer;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .product-name:hover { color: var(--primary-color); }

    .product-price {
      margin-bottom: 0.5rem;
    }

    .price-current {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .product-stock { margin-bottom: 0.75rem; }

    .in-stock {
      font-size: 0.78rem;
      color: #4ade80;
      background: rgba(74, 222, 128, 0.1);
      padding: 0.2rem 0.6rem;
      border-radius: 50px;
      border: 1px solid rgba(74, 222, 128, 0.2);
    }

    .out-stock {
      font-size: 0.78rem;
      color: #f87171;
      background: rgba(248, 113, 113, 0.1);
      padding: 0.2rem 0.6rem;
      border-radius: 50px;
      border: 1px solid rgba(248, 113, 113, 0.2);
    }

    .card-actions {
      display: flex;
      gap: 0.6rem;
    }

    .btn-cart {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.6rem 1rem;
      background: var(--primary-gradient);
      color: #04080f;
      font-family: var(--font-heading);
      font-weight: 600;
      font-size: 0.85rem;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-cart:hover:not(:disabled) {
      filter: brightness(1.1);
      transform: translateY(-1px);
    }

    .btn-cart:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-remove {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.6rem;
      background: rgba(255, 59, 59, 0.1);
      border: 1px solid rgba(255, 59, 59, 0.25);
      border-radius: 10px;
      color: #ff4d4d;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-remove:hover {
      background: rgba(255, 59, 59, 0.25);
      transform: scale(1.05);
    }

    @media (max-width: 640px) {
      .wishlist-grid { grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
    }
  `]
})
export class WishlistComponent implements OnInit {
  wishlistItems: any[] = [];
  addingToCart: { [key: number]: boolean } = {};

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.wishlistService.wishlistItems$.subscribe(items => {
      this.wishlistItems = items;
    });
    this.wishlistService.loadWishlist();
  }

  getProductImage(product: any): string {
    if (product.imageUrl) {
      if (product.imageUrl.startsWith('http')) return product.imageUrl;
      return `http://localhost:8080${product.imageUrl}`;
    }
    return 'assets/placeholder.png';
  }

  onImageError(event: any): void {
    event.target.src = 'assets/placeholder.png';
  }

  formatPrice(price: number): string {
    return price?.toLocaleString('uz-UZ') || '0';
  }

  goToProduct(productId: number): void {
    this.router.navigate(['/product', productId]);
  }

  addToCart(item: any): void {
    this.addingToCart[item.id] = true;
    this.cartService.addToCart(item.product.id, 1).subscribe({
      next: () => {
        this.addingToCart[item.id] = false;
      },
      error: () => {
        this.addingToCart[item.id] = false;
      }
    });
  }

  removeFromWishlist(item: any): void {
    this.wishlistService.removeFromWishlist(item.id).subscribe();
  }

  clearWishlist(): void {
    if (confirm('Barcha sevimlilarni o\'chirmoqchimisiz?')) {
      this.wishlistService.clearWishlist().subscribe();
    }
  }
}
