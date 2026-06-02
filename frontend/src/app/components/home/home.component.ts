import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="home-container fade-in-el">
      <!-- Hero Banner -->
      <section class="hero-banner glass-panel">
        <div class="hero-text">
          <span class="hero-tag">NexShop Premium</span>
          <h1>Kafolatlangan Texnologiyalar Olamiga Xush Kelibsiz!</h1>
          <p>Bizda eng so'nggi rusumdagi smartfonlar, noutbuklar va professional aksessuarlar eng qulay shartlarda.</p>
        </div>
        <div class="hero-glow-effect"></div>
      </section>

      <!-- Main Layout -->
      <div class="catalog-layout">
        <!-- Category Filter Sidebar -->
        <aside class="sidebar glass-panel">
          <h3>Kategoriyalar</h3>
          <ul class="category-list">
            <li 
              [class.active]="selectedCategoryId === null"
              (click)="selectCategory(null)"
            >
              Barcha mahsulotlar
            </li>
            <li 
              *ngFor="let category of categories"
              [class.active]="selectedCategoryId === category.id"
              (click)="selectCategory(category.id)"
            >
              {{ category.name }}
            </li>
          </ul>
        </aside>

        <!-- Product Grid Area -->
        <main class="products-area">
          <div class="area-header">
            <h2>{{ catalogTitle }}</h2>
            <p *ngIf="products.length > 0" class="results-count">{{ products.length }} ta mahsulot topildi</p>
          </div>

          <!-- Loading state -->
          <div *ngIf="isLoading" class="loading-container">
            <div class="spinner"></div>
            <p>Mahsulotlar yuklanmoqda...</p>
          </div>

          <!-- Empty state -->
          <div *ngIf="!isLoading && products.length === 0" class="empty-products glass-panel">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="empty-icon"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
            <h3>Hech qanday mahsulot topilmadi</h3>
            <p>Boshqa kategoriya yoki qidiruv so'rovini sinab ko'ring.</p>
            <button (click)="resetCatalog()" class="btn-primary">Katalogga qaytish</button>
          </div>

          <!-- Grid -->
          <div *ngIf="!isLoading && products.length > 0" class="products-grid">
            <div *ngFor="let product of products" class="product-card glass-card">
              <div class="product-img-wrapper" [routerLink]="['/product', product.id]">
                <img [src]="product.imageUrl" [alt]="product.name" class="product-img" />
                <span class="category-badge">{{ product.category?.name }}</span>
              </div>
              
              <div class="product-info">
                <h3 [routerLink]="['/product', product.id]" class="product-name">{{ product.name }}</h3>
                <p class="product-desc">{{ truncateText(product.description, 90) }}</p>
                
                <div class="product-footer">
                  <div class="product-price">\${{ product.price | number:'1.2-2' }}</div>
                  
                  <button 
                    *ngIf="product.stockQuantity > 0; else outOfStockBtn"
                    (click)="addToCart(product)" 
                    [disabled]="addingProductId === product.id"
                    class="btn-add-to-cart"
                  >
                    <span *ngIf="addingProductId !== product.id">
                      Savatga +
                    </span>
                    <span *ngIf="addingProductId === product.id" class="added-feedback">
                      Qo'shildi!
                    </span>
                  </button>
                  <ng-template #outOfStockBtn>
                    <span class="out-of-stock">Tugagan</span>
                  </ng-template>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .hero-banner {
      position: relative;
      padding: 4rem 3rem;
      border-radius: var(--border-radius-lg);
      margin-bottom: 2.5rem;
      overflow: hidden;
      display: flex;
      align-items: center;
      background: linear-gradient(135deg, rgba(23, 29, 43, 0.6) 0%, rgba(10, 13, 20, 0.6) 100%);
    }

    .hero-text {
      max-width: 700px;
      z-index: 2;
    }

    .hero-tag {
      display: inline-block;
      padding: 0.35rem 0.85rem;
      background: rgba(0, 242, 254, 0.1);
      border: 1px solid rgba(0, 242, 254, 0.3);
      color: var(--primary-color);
      font-size: 0.8rem;
      font-weight: 700;
      border-radius: 50px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 1.25rem;
      box-shadow: 0 0 15px rgba(0, 242, 254, 0.15);
    }

    .hero-text h1 {
      font-size: 3rem;
      line-height: 1.2;
      margin-bottom: 1rem;
      font-weight: 800;
      background: linear-gradient(to right, #ffffff, #d2d6dc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-text p {
      color: var(--text-secondary);
      font-size: 1.15rem;
    }

    .hero-glow-effect {
      position: absolute;
      top: -20%;
      right: -10%;
      width: 400px;
      height: 400px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(0, 242, 254, 0.15) 0%, rgba(255, 15, 123, 0.05) 50%, transparent 100%);
      filter: blur(50px);
      z-index: 1;
    }

    .catalog-layout {
      display: flex;
      gap: 2rem;
    }

    .sidebar {
      width: 280px;
      height: fit-content;
      padding: 1.75rem 1.5rem;
      flex-shrink: 0;
    }

    .sidebar h3 {
      font-size: 1.2rem;
      color: var(--text-primary);
      margin-bottom: 1.25rem;
      font-family: var(--font-heading);
      border-bottom: 1px solid var(--glass-border);
      padding-bottom: 0.75rem;
    }

    .category-list {
      list-style: none;
    }

    .category-list li {
      padding: 0.75rem 1rem;
      border-radius: var(--border-radius-sm);
      color: var(--text-secondary);
      cursor: pointer;
      font-weight: 500;
      transition: var(--transition-smooth);
      margin-bottom: 0.5rem;
    }

    .category-list li:hover {
      background: rgba(255, 255, 255, 0.03);
      color: var(--text-primary);
      transform: translateX(3px);
    }

    .category-list li.active {
      background: rgba(0, 242, 254, 0.08);
      border-left: 3px solid var(--primary-color);
      color: var(--primary-color);
      font-weight: 600;
    }

    .products-area {
      flex: 1;
    }

    .area-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.75rem;
    }

    .area-header h2 {
      font-size: 1.6rem;
      font-weight: 700;
    }

    .results-count {
      color: var(--text-secondary);
      font-size: 0.9rem;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.75rem;
    }

    .product-card {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 0;
      overflow: hidden;
    }

    .product-img-wrapper {
      position: relative;
      width: 100%;
      height: 200px;
      overflow: hidden;
      cursor: pointer;
      background: rgba(0, 0, 0, 0.2);
    }

    .product-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .product-card:hover .product-img {
      transform: scale(1.08);
    }

    .category-badge {
      position: absolute;
      bottom: 12px;
      left: 12px;
      background: rgba(11, 14, 20, 0.85);
      border: 1px solid var(--glass-border);
      color: var(--text-primary);
      padding: 0.2rem 0.6rem;
      font-size: 0.75rem;
      font-weight: 600;
      border-radius: 4px;
      backdrop-filter: blur(5px);
    }

    .product-info {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .product-name {
      font-size: 1.15rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
      cursor: pointer;
      text-decoration: none;
      transition: var(--transition-smooth);
    }

    .product-name:hover {
      color: var(--primary-color);
    }

    .product-desc {
      font-size: 0.85rem;
      color: var(--text-secondary);
      line-height: 1.5;
      margin-bottom: 1.25rem;
      flex: 1;
    }

    .product-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding-top: 0.85rem;
    }

    .product-price {
      font-size: 1.3rem;
      font-weight: 800;
      background: var(--primary-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-family: var(--font-heading);
    }

    .btn-add-to-cart {
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      color: var(--text-primary);
      padding: 0.5rem 0.95rem;
      font-size: 0.85rem;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      transition: var(--transition-smooth);
    }

    .btn-add-to-cart:hover {
      background: var(--primary-gradient);
      border-color: transparent;
      color: #04080f;
      box-shadow: 0 0 12px var(--primary-glow);
    }

    .added-feedback {
      color: var(--success-color);
      font-weight: 700;
    }

    .out-of-stock {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-secondary);
      background: rgba(255, 255, 255, 0.05);
      padding: 0.25rem 0.6rem;
      border-radius: 4px;
    }

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
      border: 3px dashed var(--primary-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin {
      100% { transform: rotate(360deg); }
    }

    .empty-products {
      padding: 4rem 2rem;
      text-align: center;
      max-width: 500px;
      margin: 2rem auto;
    }

    .empty-icon {
      color: var(--text-secondary);
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .empty-products h3 {
      font-size: 1.3rem;
      margin-bottom: 0.5rem;
    }

    .empty-products p {
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
    }

    @media (max-width: 1024px) {
      .catalog-layout {
        flex-direction: column;
      }
      .sidebar {
        width: 100%;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  categories: any[] = [];
  products: any[] = [];
  selectedCategoryId: number | null = null;
  searchQuery: string = '';
  catalogTitle: string = 'Barcha mahsulotlar';
  isLoading = true;
  addingProductId: number | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadCategories();

    // Listen to query parameters for search queries
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      this.selectedCategoryId = params['category'] ? +params['category'] : null;

      if (this.searchQuery) {
        this.searchProducts(this.searchQuery);
      } else if (this.selectedCategoryId !== null) {
        this.loadProductsByCategory(this.selectedCategoryId);
      } else {
        this.loadAllProducts();
      }
    });
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe(cats => {
      this.categories = cats;
    });
  }

  loadAllProducts(): void {
    this.isLoading = true;
    this.catalogTitle = 'Barcha mahsulotlar';
    this.productService.getProducts().subscribe({
      next: (prods) => {
        this.products = prods.filter(p => p.isActive);
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  loadProductsByCategory(categoryId: number): void {
    this.isLoading = true;
    this.productService.getCategoryById(categoryId).subscribe(cat => {
      this.catalogTitle = cat.name;
    });

    this.productService.getProductsByCategory(categoryId).subscribe({
      next: (prods) => {
        this.products = prods.filter(p => p.isActive);
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  searchProducts(query: string): void {
    this.isLoading = true;
    this.catalogTitle = `"${query}" bo'yicha qidiruv natijalari`;
    this.productService.searchProducts(query).subscribe({
      next: (prods) => {
        this.products = prods.filter(p => p.isActive);
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  selectCategory(categoryId: number | null): void {
    this.selectedCategoryId = categoryId;
    this.searchQuery = '';
    if (categoryId === null) {
      this.loadAllProducts();
    } else {
      this.loadProductsByCategory(categoryId);
    }
  }

  resetCatalog(): void {
    this.selectCategory(null);
  }

  addToCart(product: any): void {
    if (!this.authService.isLoggedIn()) {
      alert('Savatga mahsulot qo\'shish uchun avval tizimga kiring!');
      return;
    }

    this.addingProductId = product.id;
    this.cartService.addToCart(product.id, 1).subscribe({
      next: () => {
        setTimeout(() => {
          this.addingProductId = null;
        }, 1000);
      },
      error: (err) => {
        alert(err.error?.message || 'Xatolik yuz berdi!');
        this.addingProductId = null;
      }
    });
  }

  truncateText(text: string, limit: number): string {
    if (!text) return '';
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  }
}
