import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-catalog-portal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="catalog-portal-backdrop" *ngIf="isOpen" (click)="closePortal()">
      <div class="catalog-portal-window" (click)="$event.stopPropagation()">
        <div class="portal-header">
          <div class="portal-title-wrapper">
            <span class="portal-logo-glow">NexShop</span>
            <span class="portal-title-sep">/</span>
            <h2>Mahsulotlar Katalogi</h2>
          </div>
          <button class="portal-close-btn" (click)="closePortal()">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            Yopish
          </button>
        </div>

        <div class="portal-body">
          <!-- Left sidebar (Main Categories) -->
          <aside class="portal-sidebar">
            <div 
              *ngFor="let cat of categories" 
              class="portal-sidebar-item" 
              [class.active]="activeCategory?.id === cat.id"
              (mouseenter)="setActiveCategory(cat)"
              (click)="onCategorySelect(cat)"
            >
              <div class="portal-sidebar-item-inner">
                <span class="portal-cat-icon" *ngIf="!cat.imageUrl">{{ getCategoryIcon(cat.name) }}</span>
                <img *ngIf="cat.imageUrl" [src]="cat.imageUrl" [alt]="cat.name" class="portal-cat-thumb" />
                <span class="portal-cat-name">{{ cat.name }}</span>
              </div>
              <svg class="portal-chevron" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
          </aside>

          <!-- Right panel (Subcategories and Child Categories) -->
          <main class="portal-content" *ngIf="activeCategory">
            <div class="portal-content-header" (click)="onCategorySelect(activeCategory)">
              <h2>{{ activeCategory.name }}</h2>
              <span class="portal-view-all">Barchasini ko'rish &rarr;</span>
            </div>

            <div class="portal-subcategories-grid">
              <div class="portal-subcat-group" *ngFor="let sub of activeCategory.subcategories">
                <h3 class="portal-subcat-title" (click)="onSubcategorySelect(sub)">
                  {{ sub.name }}
                </h3>
                
                <ul class="portal-childcat-list">
                  <li *ngFor="let child of sub.childCategories">
                    <a class="portal-childcat-link" (click)="onChildCategorySelect(child)">
                      {{ child.name }}
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .catalog-portal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.45);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      z-index: 9999;
      display: flex;
      justify-content: center;
      align-items: center;
      animation: portalFadeIn 0.25s ease-out forwards;
    }

    .catalog-portal-window {
      width: calc(100% - 2rem);
      max-width: 1200px;
      height: 80vh;
      max-height: 680px;
      background: #ffffff !important;
      color: #111827;
      border-radius: var(--border-radius-md, 16px);
      border: 1px solid var(--glass-border);
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      animation: portalSlideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      overflow: hidden;
    }

    :host-context([data-theme="dark"]) .catalog-portal-window {
      background: #0b0e14 !important;
      color: #f3f4f6;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.65);
    }

    @keyframes portalFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes portalSlideUp {
      from { opacity: 0; transform: scale(0.9) translateY(20px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }

    .portal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 2rem;
      border-bottom: 1px solid var(--glass-border);
      background: rgba(0, 0, 0, 0.01);
    }
    
    :host-context([data-theme="dark"]) .portal-header {
      background: rgba(255, 255, 255, 0.01);
    }

    .portal-title-wrapper {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .portal-logo-glow {
      font-size: 1.3rem;
      font-weight: 800;
      background: var(--primary-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 0 8px var(--primary-glow));
    }

    .portal-title-sep {
      color: var(--text-secondary);
      opacity: 0.5;
      font-weight: 300;
    }

    .portal-header h2 {
      font-size: 1.3rem;
      margin: 0;
      color: var(--text-primary);
    }

    .portal-close-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      color: var(--text-primary);
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      transition: var(--transition-smooth);
    }

    .portal-close-btn:hover {
      background: var(--danger-color);
      color: white;
      border-color: var(--danger-color);
      box-shadow: 0 0 12px rgba(220, 38, 38, 0.35);
    }

    .portal-body {
      display: flex;
      flex: 1;
      height: calc(100% - 70px);
      overflow: hidden;
    }

    .portal-sidebar {
      width: 280px;
      border-right: 1px solid var(--glass-border);
      background: rgba(0, 0, 0, 0.01);
      overflow-y: auto;
      padding: 1rem 0;
      display: flex;
      flex-direction: column;
      gap: 2px;
      flex-shrink: 0;
    }

    :host-context([data-theme="dark"]) .portal-sidebar {
      background: rgba(255, 255, 255, 0.01);
    }

    .portal-sidebar::-webkit-scrollbar {
      width: 5px;
    }

    .portal-sidebar::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 4px;
    }

    :host-context([data-theme="dark"]) .portal-sidebar::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.05);
    }

    .portal-sidebar-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.85rem 1.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
      color: var(--text-secondary);
      border-left: 3px solid transparent;
    }

    .portal-sidebar-item:hover, .portal-sidebar-item.active {
      color: var(--primary-color);
      background: rgba(0, 242, 254, 0.04);
      border-left-color: var(--primary-color);
    }

    .portal-sidebar-item-inner {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .portal-cat-icon {
      font-size: 1.2rem;
    }

    .portal-cat-thumb {
      width: 32px;
      height: 32px;
      object-fit: cover;
      border-radius: 8px;
      border: 1px solid var(--glass-border);
      flex-shrink: 0;
    }

    .portal-cat-name {
      font-size: 0.95rem;
      font-weight: 600;
    }

    .portal-chevron {
      opacity: 0;
      transition: var(--transition-smooth);
      color: var(--primary-color);
    }

    .portal-sidebar-item:hover .portal-chevron, .portal-sidebar-item.active .portal-chevron {
      opacity: 1;
      transform: translateX(2px);
    }

    .portal-content {
      flex: 1;
      padding: 2rem;
      overflow-y: auto;
      background: #ffffff;
    }

    :host-context([data-theme="dark"]) .portal-content {
      background: #0b0e14;
    }

    .portal-content::-webkit-scrollbar {
      width: 6px;
    }

    .portal-content::-webkit-scrollbar-thumb {
      background: var(--scrollbar-thumb);
      border-radius: 4px;
    }

    .portal-content-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2rem;
      padding-bottom: 0.75rem;
      border-bottom: 2px solid var(--primary-color);
      cursor: pointer;
    }

    .portal-content-header h2 {
      font-size: 1.6rem;
      font-weight: 800;
      color: var(--text-primary);
      margin: 0;
    }

    .portal-view-all {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--primary-color);
      transition: transform 0.2s;
    }

    .portal-content-header:hover .portal-view-all {
      transform: translateX(4px);
    }

    .portal-subcategories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 2rem;
      align-items: start;
    }

    .portal-subcat-group {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .portal-subcat-title {
      font-size: 1.05rem;
      font-weight: 800;
      color: var(--text-primary);
      margin: 0;
      cursor: pointer;
      transition: color 0.2s;
    }

    .portal-subcat-title:hover {
      color: var(--primary-color);
    }

    .portal-childcat-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .portal-childcat-link {
      font-size: 0.9rem;
      color: var(--text-secondary);
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s ease;
      display: inline-block;
    }

    .portal-childcat-link:hover {
      color: var(--primary-color);
      padding-left: 4px;
    }

    @media (max-width: 768px) {
      .catalog-portal-window {
        left: 0.5rem;
        right: 0.5rem;
        max-height: 85vh;
      }

      .portal-body {
        flex-direction: column;
      }

      .portal-sidebar {
        width: 100%;
        height: 120px;
        flex-direction: row;
        overflow-x: auto;
        overflow-y: hidden;
        border-right: none;
        border-bottom: 1px solid var(--glass-border);
        padding: 0.5rem;
        gap: 0.5rem;
      }

      .portal-sidebar-item {
        flex-direction: column;
        padding: 0.5rem 1rem;
        min-width: 120px;
        text-align: center;
        border-left: none;
        border-bottom: 3px solid transparent;
        justify-content: center;
      }

      .portal-sidebar-item.active {
        border-bottom-color: var(--primary-color);
      }

      .portal-sidebar-item-inner {
        flex-direction: column;
        gap: 4px;
      }

      .portal-chevron {
        display: none;
      }

      .portal-content {
        padding: 1rem;
      }

      .portal-subcategories-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
    }
  `]
})
export class CatalogPortalComponent implements OnInit, OnDestroy {
  isOpen = false;
  categories: any[] = [];
  activeCategory: any = null;
  private catalogSub?: Subscription;

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.catalogSub = this.productService.isCatalogOpen$.subscribe(isOpen => {
      this.isOpen = isOpen;
      if (isOpen) {
        document.body.style.overflow = 'hidden';
        if (this.categories.length === 0) {
          this.loadCategories();
        } else if (!this.activeCategory && this.categories.length > 0) {
          this.activeCategory = this.categories[0];
        }
      } else {
        document.body.style.overflow = '';
      }
    });
  }

  ngOnDestroy(): void {
    if (this.catalogSub) {
      this.catalogSub.unsubscribe();
    }
    document.body.style.overflow = '';
  }

  loadCategories(): void {
    this.productService.getCategories().subscribe(cats => {
      this.categories = cats;
      if (cats.length > 0 && !this.activeCategory) {
        this.activeCategory = cats[0];
      }
    });
  }

  closePortal(): void {
    this.productService.isCatalogOpen$.next(false);
  }

  setActiveCategory(cat: any): void {
    this.activeCategory = cat;
  }

  onCategorySelect(cat: any): void {
    this.closePortal();
    this.router.navigate(['/catalog'], { queryParams: { category: cat.id } });
  }

  onSubcategorySelect(sub: any): void {
    this.closePortal();
    this.router.navigate(['/catalog'], { queryParams: { subcategory: sub.id } });
  }

  onChildCategorySelect(child: any): void {
    this.closePortal();
    this.router.navigate(['/catalog'], { queryParams: { childCategory: child.id } });
  }

  getCategoryIcon(name: string): string {
    const n = name.toLowerCase();
    if (n.includes('smartfon') || n.includes('telefon')) return '📱';
    if (n.includes('audio') || n.includes('naushnik')) return '🎧';
    if (n.includes('noutbuk') || n.includes('kompyuter') || n.includes('notebook')) return '💻';
    if (n.includes('tv') || n.includes('televizor') || n.includes('proyektor')) return '📺';
    if (n.includes('uy uchun') || n.includes('kir yuvish') || n.includes('changyutgich')) return '🏠';
    if (n.includes('oshxona') || n.includes('mikrotolqinli') || n.includes('duxovka')) return '🍳';
    if (n.includes('go\'zallik') || n.includes('parvarish') || n.includes('fen')) return '🧴';
    if (n.includes('aqlli') || n.includes('smart')) return '💡';
    if (n.includes('o\'yin') || n.includes('game') || n.includes('playstation')) return '🎮';
    if (n.includes('sport') || n.includes('trenajor')) return '⚽';
    if (n.includes('avto')) return '🚗';
    if (n.includes('bolalar') || n.includes('o\'yinchoq')) return '🧸';
    return '📦';
  }
}
