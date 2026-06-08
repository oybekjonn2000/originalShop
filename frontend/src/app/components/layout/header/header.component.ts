import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';
import { WishlistService } from '../../../services/wishlist.service';
import { HostListener } from '@angular/core';
import { ElementRef } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <header class="header-container glass-panel">
      <div class="header-content">
        <!-- Logo -->
        <a routerLink="/" class="logo">
          <span class="logo-glow">Nex</span>Shop
        </a>

        <!-- Search Bar (desktop) -->
        <div class="search-box">
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            (keyup.enter)="onSearch()"
            placeholder="Mahsulotlarni qidirish..." 
            class="glass-input search-input"
          />
          <button (click)="onSearch()" class="search-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
        </div>

        <!-- Desktop Navigation -->
        <nav class="nav-actions nav-desktop">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link" title="Asosiy">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          </a>
          <a routerLink="/catalog" routerLinkActive="active" class="nav-link" title="Katalog">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          </a>
          <a routerLink="/about" routerLinkActive="active" class="nav-link" title="Biz haqimizda">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          </a>
          <a routerLink="/contact" routerLinkActive="active" class="nav-link" title="Aloqa">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          </a>
          <a *ngIf="isLoggedIn" routerLink="/wishlist" routerLinkActive="active" class="nav-link wishlist-link" title="Sevimlilar">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            <span *ngIf="wishlistCount > 0" class="wishlist-badge">{{ wishlistCount }}</span>
          </a>
          <a routerLink="/cart" routerLinkActive="active" class="nav-link cart-link" title="Savat">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            <span *ngIf="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
          </a>
          <ng-container *ngIf="isLoggedIn; else authLinksDesktop">
            <a routerLink="/orders" routerLinkActive="active" class="nav-link" title="Buyurtmalarim">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><polygon points="12 22.08 12 12 3 6.92 3 17.08 12 22.08"></polygon><polygon points="12 22.08 21 17.08 21 6.92 12 12 12 22.08"></polygon><polygon points="12 12 21 6.92 12 1.84 3 6.92 12 12"></polygon></svg>
            </a>
            <a *ngIf="isAdmin" routerLink="/admin" routerLinkActive="active" class="nav-link admin-link">Admin Panel</a>
            <div class="user-menu">
              <a routerLink="/profile" class="username-display" style="text-decoration:none;display:flex;align-items:center;gap:5px">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                {{ currentUser?.firstName || currentUser?.username }}
              </a>
              <button (click)="logout()" class="btn-logout" title="Chiqish">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              </button>
            </div>
          </ng-container>
          <ng-template #authLinksDesktop>
            <div class="auth-buttons">
              <a routerLink="/login" class="nav-link">Kirish</a>
              <a routerLink="/register" class="btn-primary-sm">Ro'yxatdan o'tish</a>
            </div>
          </ng-template>
        </nav>

        <!-- Mobile Right Side (wishlist + cart + burger) -->
        <div class="mobile-right">
          <a *ngIf="isLoggedIn" routerLink="/wishlist" class="nav-link wishlist-link mobile-wishlist" style="padding: 0.4rem; display: flex; align-items: center; justify-content: center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            <span *ngIf="wishlistCount > 0" class="wishlist-badge">{{ wishlistCount }}</span>
          </a>
          <a routerLink="/cart" class="nav-link cart-link mobile-cart">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            <span *ngIf="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
          </a>
          <button class="hamburger-btn" (click)="toggleMenu()" [class.open]="menuOpen">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>

      <!-- Mobile Search Bar -->
      <div class="mobile-search">
        <div class="search-box" style="max-width:100%">
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            (keyup.enter)="onSearch()"
            placeholder="Qidirish..." 
            class="glass-input search-input"
          />
          <button (click)="onSearch()" class="search-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Menu -->
      <nav class="mobile-nav" [class.open]="menuOpen">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="mobile-nav-link" (click)="closeMenu()">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
          Asosiy
        </a>
        <a routerLink="/catalog" routerLinkActive="active" class="mobile-nav-link" (click)="closeMenu()">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          Katalog
        </a>
        <a routerLink="/about" routerLinkActive="active" class="mobile-nav-link" (click)="closeMenu()">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          Biz haqimizda
        </a>
        <a routerLink="/contact" routerLinkActive="active" class="mobile-nav-link" (click)="closeMenu()">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          Aloqa
        </a>
        <ng-container *ngIf="isLoggedIn; else mobileAuthLinks">
          <a routerLink="/wishlist" routerLinkActive="active" class="mobile-nav-link" (click)="closeMenu()" style="display: flex; align-items: center; gap: 8px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            Sevimlilar <span *ngIf="wishlistCount > 0" class="wishlist-badge" style="position: static; display: inline-flex; margin-left: 0.5rem; transform: none;">{{ wishlistCount }}</span>
          </a>
          <a routerLink="/orders" routerLinkActive="active" class="mobile-nav-link" (click)="closeMenu()">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><polygon points="12 22.08 12 12 3 6.92 3 17.08 12 22.08"></polygon><polygon points="12 22.08 21 17.08 21 6.92 12 12 12 22.08"></polygon><polygon points="12 12 21 6.92 12 1.84 3 6.92 12 12"></polygon></svg>
            Buyurtmalarim
          </a>
          <a routerLink="/profile" routerLinkActive="active" class="mobile-nav-link" (click)="closeMenu()">
            {{ currentUser?.firstName || currentUser?.username }} — Profil
          </a>
          <a *ngIf="isAdmin" routerLink="/admin" routerLinkActive="active" class="mobile-nav-link admin-mobile" (click)="closeMenu()">Admin Panel</a>
          <button (click)="logout(); closeMenu()" class="mobile-nav-link logout-mobile">Chiqish</button>
        </ng-container>
        <ng-template #mobileAuthLinks>
          <a routerLink="/login" class="mobile-nav-link" (click)="closeMenu()">Kirish</a>
          <a routerLink="/register" class="mobile-nav-link register-mobile" (click)="closeMenu()">Ro'yxatdan o'tish</a>
        </ng-template>
      </nav>
    </header>
  `,
  styles: [`
    .header-container {
      position: sticky;
      top: 0;
      z-index: 1000;
      margin: 0 auto 1.5rem auto;
      max-width: 1400px;
      width: calc(100% - 2rem);
      padding: 0.85rem 2rem;
      border-radius: 0 0 16px 16px;
      border-top: none;
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
    }

    .logo {
      font-family: var(--font-heading);
      font-size: 1.6rem;
      font-weight: 800;
      color: var(--text-primary);
      text-decoration: none;
      letter-spacing: -0.03em;
      flex-shrink: 0;
    }

    .logo-glow {
      background: var(--primary-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 0 8px rgba(0, 242, 254, 0.4));
    }

    .search-box {
      position: relative;
      flex: 1;
      max-width: 480px;
      display: flex;
      align-items: center;
    }

    .search-input {
      padding-right: 3.5rem;
      border-radius: 50px;
      height: 42px;
      width: 100%;
    }

    .search-btn {
      position: absolute;
      right: 5px;
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--transition-smooth);
    }

    .search-btn:hover { color: var(--primary-color); transform: scale(1.1); }

    /* Desktop Nav */
    .nav-desktop {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-shrink: 0;
    }

    .mobile-right { display: none; }
    .mobile-search { display: none; }
    .mobile-nav { display: none; }

    .nav-link {
      font-family: var(--font-heading);
      font-size: 0.9rem;
      font-weight: 500;
      color: var(--text-secondary);
      text-decoration: none;
      padding: 0.4rem 0.65rem;
      border-radius: 8px;
      transition: var(--transition-smooth);
      white-space: nowrap;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .nav-link:hover, .nav-link.active {
      color: var(--text-primary);
      background: rgba(255, 255, 255, 0.04);
    }

    .cart-link {
      position: relative;
      padding-right: 1.5rem;
    }

    .cart-badge {
      position: absolute;
      top: -3px;
      right: -2px;
      background: var(--secondary-gradient);
      color: white;
      font-size: 0.65rem;
      font-weight: 700;
      min-width: 17px;
      height: 17px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 10px rgba(255, 15, 123, 0.4);
    }

    .wishlist-link {
      position: relative;
      padding-right: 1.5rem;
    }

    .wishlist-badge {
      position: absolute;
      top: -3px;
      right: -2px;
      background: linear-gradient(135deg, #ff4d6d 0%, #ff758f 100%);
      color: white;
      font-size: 0.65rem;
      font-weight: 700;
      min-width: 17px;
      height: 17px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 10px rgba(255, 77, 109, 0.4);
    }

    .admin-link {
      border: 1px dashed rgba(247, 107, 28, 0.4);
      color: #f76b1c !important;
    }

    .admin-link:hover, .admin-link.active {
      background: rgba(247, 107, 28, 0.1) !important;
      border-color: #f76b1c;
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: rgba(255, 255, 255, 0.03);
      padding: 0.35rem 0.75rem;
      border-radius: 50px;
      border: 1px solid var(--glass-border);
    }

    .username-display {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .btn-logout {
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      display: flex;
      align-items: center;
      transition: var(--transition-smooth);
    }

    .btn-logout:hover { color: var(--danger-color); transform: scale(1.1); }

    .auth-buttons {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .btn-primary-sm {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.45rem 0.9rem;
      background: var(--primary-gradient);
      color: #04080f;
      font-family: var(--font-heading);
      font-weight: 600;
      font-size: 0.82rem;
      border: none;
      border-radius: 8px;
      text-decoration: none;
      box-shadow: 0 4px 10px 0 rgba(0, 242, 254, 0.2);
      transition: var(--transition-smooth);
      white-space: nowrap;
    }

    .btn-primary-sm:hover {
      box-shadow: 0 6px 15px 0 rgba(0, 242, 254, 0.4);
      filter: brightness(1.1);
    }

    /* --- TABLET (max 1024px) --- */
    @media (max-width: 1024px) {
      .header-container { padding: 0.85rem 1.25rem; }
      .nav-link { font-size: 0.82rem; padding: 0.35rem 0.5rem; }
      .search-box { max-width: 300px; }
    }

    /* --- MOBILE (max 768px) --- */
    @media (max-width: 768px) {
      .header-container {
        width: calc(100% - 1rem);
        padding: 0.75rem 1rem 0;
      }

      .nav-desktop { display: none; }
      .search-box { display: none; }

      .mobile-right {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .mobile-cart {
        position: relative;
        color: var(--text-secondary);
        display: flex;
        align-items: center;
        padding: 0.4rem;
        border-radius: 8px;
      }

      .hamburger-btn {
        background: none;
        border: 1px solid var(--glass-border);
        border-radius: 8px;
        cursor: pointer;
        width: 40px;
        height: 38px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 5px;
        padding: 6px;
        transition: all 0.3s ease;
        background: rgba(255,255,255,0.03);
      }

      .hamburger-btn span {
        display: block;
        width: 100%;
        height: 2px;
        background: var(--text-primary);
        border-radius: 2px;
        transition: all 0.3s ease;
        transform-origin: center;
      }

      .hamburger-btn.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
      .hamburger-btn.open span:nth-child(2) { opacity: 0; }
      .hamburger-btn.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

      .mobile-search {
        display: flex;
        padding: 0.75rem 0 0;
      }

      .mobile-search .search-box {
        display: flex;
        max-width: 100%;
        width: 100%;
        flex: 1;
      }

      /* Mobile dropdown nav */
      .mobile-nav {
        display: flex;
        flex-direction: column;
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.4s ease, padding 0.3s ease;
      }

      .mobile-nav.open {
        max-height: 600px;
        padding: 0.5rem 0 1rem;
      }

      .mobile-nav-link {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 0.75rem 0.5rem;
        color: var(--text-secondary);
        text-decoration: none;
        font-size: 1rem;
        font-weight: 500;
        border-bottom: 1px solid rgba(255,255,255,0.04);
        transition: all 0.2s ease;
        background: none;
        border-left: none;
        border-right: none;
        border-top: none;
        cursor: pointer;
        text-align: left;
        width: 100%;
        font-family: var(--font-heading);
      }

      .mobile-nav-link:hover, .mobile-nav-link.active {
        color: var(--primary-color);
        padding-left: 1rem;
      }

      .admin-mobile {
        color: #f76b1c !important;
      }

      .logout-mobile {
        color: var(--danger-color) !important;
      }

      .register-mobile {
        color: var(--primary-color) !important;
        font-weight: 700;
      }
    }

    /* --- Small Mobile (max 480px) --- */
    @media (max-width: 480px) {
      .logo { font-size: 1.3rem; }
      .header-container { width: 100%; border-radius: 0; margin-bottom: 1rem; }
    }
  `]
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  isAdmin = false;
  currentUser: any = null;
  cartCount = 0;
  wishlistCount = 0;
  searchQuery = '';
  menuOpen = false;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
      this.isAdmin = this.authService.isAdmin();
    });

    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });

    this.wishlistService.wishlistCount$.subscribe(count => {
      this.wishlistCount = count;
    });
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  onSearch(): void {
    if (this.searchQuery && this.searchQuery.trim()) {
      this.router.navigate(['/catalog'], { queryParams: { q: this.searchQuery.trim() } });
    } else {
      this.router.navigate(['/']);
    }
    this.closeMenu();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
