import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="catalog-container fade-in-el">
      <!-- Header -->
      <div class="page-header text-center">
        <h1>Barcha Mahsulotlar</h1>
        <p class="subtitle">Eng so'nggi va sifatli texnikalarni kashf eting</p>
      </div>

      <div class="catalog-layout">
        <!-- Sidebar Filters -->
        <aside class="filters-sidebar glass-panel">
          <div class="filter-section">
            <h3>Qidiruv</h3>
            <div class="search-box">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" [(ngModel)]="searchTerm" (input)="applyFilters()" placeholder="Mahsulot nomini kiriting..." class="glass-input">
            </div>
          </div>

          <div class="filter-section">
            <h3>Kategoriyalar</h3>
            <ul class="category-list">
              <li [class.active]="selectedCategoryId === null" (click)="selectCategory(null)">Barchasi</li>
              <li *ngFor="let cat of categories" 
                  [class.active]="selectedCategoryId === cat.id" 
                  (click)="selectCategory(cat.id)">
                {{ cat.name }}
              </li>
            </ul>
          </div>

          <div class="filter-section">
            <h3>Saralash (Sort)</h3>
            <select [(ngModel)]="sortBy" (change)="applyFilters()" class="glass-input w-full">
              <option value="newest">Yangi qo'shilganlar</option>
              <option value="priceAsc">Arzonlari oldin</option>
              <option value="priceDesc">Qimmatlari oldin</option>
              <option value="nameAsc">Alifbo bo'yicha (A-Z)</option>
            </select>
          </div>
        </aside>

        <!-- Product Grid -->
        <main class="products-main">
          <div *ngIf="isLoading" class="loading-state">
            <div class="spinner"></div>
            <p>Mahsulotlar yuklanmoqda...</p>
          </div>

          <div *ngIf="!isLoading && filteredProducts.length === 0" class="empty-state glass-panel">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <h3>Mahsulot topilmadi</h3>
            <p>Boshqa so'z bilan qidirib ko'ring yoki filtrlarni o'zgartiring.</p>
            <button (click)="resetFilters()" class="btn-secondary">Filtrlarni tozalash</button>
          </div>

          <div *ngIf="!isLoading && filteredProducts.length > 0" class="products-grid">
            <div *ngFor="let product of filteredProducts" class="product-card glass-panel">
              <div class="product-image-container">
                <img [src]="product.imageUrl" [alt]="product.name" class="product-image" />
                <div class="product-badge" *ngIf="product.stockQuantity < 5 && product.stockQuantity > 0">Sanoqli qoldi</div>
                <div class="product-badge out-of-stock" *ngIf="product.stockQuantity === 0">Tugagan</div>
              </div>
              <div class="product-info">
                <div class="product-category">{{ product.category?.name || 'Kategoriyasiz' }}</div>
                <h3 class="product-title" [routerLink]="['/product', product.id]">{{ product.name }}</h3>
                <div class="product-price">\${{ product.price | number:'1.2-2' }}</div>
                <button [routerLink]="['/product', product.id]" class="btn-primary w-full mt-3">Batafsil ko'rish</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .catalog-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .page-header {
      margin-bottom: 3rem;
      margin-top: 1rem;
    }

    .page-header h1 {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      background: var(--primary-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .catalog-layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 2rem;
      align-items: start;
    }

    /* Sidebar Filters */
    .filters-sidebar {
      padding: 1.5rem;
      position: sticky;
      top: 90px;
    }

    .filter-section {
      margin-bottom: 2rem;
    }

    .filter-section:last-child {
      margin-bottom: 0;
    }

    .filter-section h3 {
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: var(--text-primary);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .search-box {
      position: relative;
    }

    .search-box svg {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-secondary);
    }

    .search-box input {
      padding-left: 2.8rem;
      width: 100%;
    }

    .category-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .category-list li {
      padding: 0.6rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      color: var(--text-secondary);
      transition: var(--transition-smooth);
      font-size: 0.95rem;
    }

    .category-list li:hover {
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-primary);
    }

    .category-list li.active {
      background: rgba(168, 85, 247, 0.15);
      color: #a855f7;
      font-weight: 600;
      border-left: 3px solid #a855f7;
    }

    .w-full {
      width: 100%;
    }

    /* Products Grid */
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .product-card {
      padding: 0;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 100%;
      transition: var(--transition-smooth);
    }

    .product-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
      border-color: rgba(168, 85, 247, 0.3);
    }

    .product-image-container {
      position: relative;
      width: 100%;
      padding-top: 75%; /* 4:3 Aspect Ratio */
      background: rgba(0, 0, 0, 0.2);
      overflow: hidden;
    }

    .product-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .product-card:hover .product-image {
      transform: scale(1.05);
    }

    .product-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: rgba(245, 158, 11, 0.9);
      color: white;
      padding: 0.4rem 0.8rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      backdrop-filter: blur(4px);
    }

    .out-of-stock {
      background: rgba(239, 68, 68, 0.9);
    }

    .product-info {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .product-category {
      font-size: 0.8rem;
      color: var(--primary-color);
      margin-bottom: 0.5rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .product-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
      cursor: pointer;
      text-decoration: none;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .product-title:hover {
      color: var(--primary-color);
    }

    .product-price {
      font-size: 1.4rem;
      font-weight: 800;
      color: var(--text-primary);
      margin-top: auto;
      font-family: var(--font-heading);
    }

    .mt-3 {
      margin-top: 1.25rem;
    }

    /* Loading & Empty State */
    .loading-state, .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;
    }

    .empty-state {
      max-width: 500px;
      margin: 0 auto;
    }

    .empty-state svg {
      color: var(--text-secondary);
      opacity: 0.5;
      margin-bottom: 1.5rem;
    }

    .empty-state h3 {
      font-size: 1.4rem;
      margin-bottom: 0.5rem;
    }

    .empty-state p {
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px dashed #a855f7;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }

    @keyframes spin { 100% { transform: rotate(360deg); } }

    @media (max-width: 992px) {
      .catalog-layout {
        grid-template-columns: 1fr;
      }
      .filters-sidebar {
        position: static;
      }
    }
  `]
})
export class CatalogComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  categories: any[] = [];
  
  isLoading = true;
  searchTerm = '';
  selectedCategoryId: number | null = null;
  sortBy = 'newest';

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.searchTerm = params['q'];
      }
      this.loadData();
    });
  }

  loadData(): void {
    this.isLoading = true;
    
    // Kategoriyalarni yuklash
    this.productService.getCategories().subscribe({
      next: (cats) => {
        this.categories = cats;
      }
    });

    // Mahsulotlarni yuklash
    this.productService.getProducts().subscribe({
      next: (prods) => {
        this.products = prods;
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  selectCategory(id: number | null): void {
    this.selectedCategoryId = id;
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.products];

    // 1. Kategoriya bo'yicha filtr
    if (this.selectedCategoryId !== null) {
      result = result.filter(p => p.category && p.category.id === this.selectedCategoryId);
    }

    // 2. Qidiruv bo'yicha filtr
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(term));
    }

    // 3. Saralash (Sort)
    switch (this.sortBy) {
      case 'priceAsc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'nameAsc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        // Assume ID represents insertion order (newest = highest ID)
        result.sort((a, b) => b.id - a.id);
        break;
    }

    this.filteredProducts = result;
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategoryId = null;
    this.sortBy = 'newest';
    this.applyFilters();
  }
}
