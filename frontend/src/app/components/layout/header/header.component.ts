import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';

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

        <!-- Search Bar -->
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

        <!-- Navigation Actions -->
        <nav class="nav-actions">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">
            Asosiy
          </a>
          <a routerLink="/catalog" routerLinkActive="active" class="nav-link">
            Katalog
          </a>
          <a routerLink="/about" routerLinkActive="active" class="nav-link">
            Biz haqimizda
          </a>
          <a routerLink="/contact" routerLinkActive="active" class="nav-link">
            Aloqa
          </a>

          <!-- Cart Badge -->
          <a routerLink="/cart" routerLinkActive="active" class="nav-link cart-link">
            Savat
            <span *ngIf="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
          </a>

          <!-- Logged In User Links -->
          <ng-container *ngIf="isLoggedIn; else authLinks">
            <a routerLink="/orders" routerLinkActive="active" class="nav-link">
              Buyurtmalarim
            </a>
            
            <a *ngIf="isAdmin" routerLink="/admin" routerLinkActive="active" class="nav-link admin-link">
              Admin Panel
            </a>

            <!-- User Menu -->
            <div class="user-menu">
              <a routerLink="/profile" class="username-display" style="text-decoration: none; display: flex; align-items: center; gap: 5px;">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                {{ currentUser?.firstName || currentUser?.username }}
              </a>
              <button (click)="logout()" class="btn-logout" title="Chiqish">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              </button>
            </div>
          </ng-container>

          <!-- Logged Out Auth Links -->
          <ng-template #authLinks>
            <div class="auth-buttons">
              <a routerLink="/login" class="nav-link font-semibold">Kirish</a>
              <a routerLink="/register" class="btn-primary-sm">Ro'yxatdan o'tish</a>
            </div>
          </ng-template>
        </nav>
      </div>
    </header>
  `,
  styles: [`
    .header-container {
      position: sticky;
      top: 0;
      z-index: 100;
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

    .search-btn:hover {
      color: var(--primary-color);
      transform: scale(1.1);
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }

    .nav-link {
      font-family: var(--font-heading);
      font-size: 0.95rem;
      font-weight: 500;
      color: var(--text-secondary);
      text-decoration: none;
      padding: 0.4rem 0.8rem;
      border-radius: 8px;
      transition: var(--transition-smooth);
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
      font-size: 0.7rem;
      font-weight: 700;
      min-width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 10px rgba(255, 15, 123, 0.4);
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
      font-size: 0.9rem;
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

    .btn-logout:hover {
      color: var(--danger-color);
      transform: scale(1.1);
    }

    .auth-buttons {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .btn-primary-sm {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem 1rem;
      background: var(--primary-gradient);
      color: #04080f;
      font-family: var(--font-heading);
      font-weight: 600;
      font-size: 0.85rem;
      border: none;
      border-radius: 8px;
      text-decoration: none;
      box-shadow: 0 4px 10px 0 rgba(0, 242, 254, 0.2);
      transition: var(--transition-smooth);
    }

    .btn-primary-sm:hover {
      box-shadow: 0 6px 15px 0 rgba(0, 242, 254, 0.4);
      filter: brightness(1.1);
    }

    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        align-items: stretch;
      }
      .search-box {
        max-width: 100%;
      }
      .nav-actions {
        justify-content: space-around;
        flex-wrap: wrap;
      }
    }
  `]
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  isAdmin = false;
  currentUser: any = null;
  cartCount = 0;
  searchQuery = '';

  constructor(
    private authService: AuthService,
    private cartService: CartService,
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
  }

  onSearch(): void {
    if (this.searchQuery && this.searchQuery.trim()) {
      this.router.navigate(['/catalog'], { queryParams: { q: this.searchQuery.trim() } });
    } else {
      this.router.navigate(['/']);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
