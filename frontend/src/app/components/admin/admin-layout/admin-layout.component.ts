import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ThemeService } from '../../../services/theme.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-wrapper" [class.collapsed]="isSidebarCollapsed" [class.mobile-open]="isMobileSidebarOpen">
      <!-- Sidebar -->
      <aside class="admin-sidebar glass-panel">
        <div class="sidebar-header">
          <div class="logo">
            <span class="logo-nex">Nex</span><span class="logo-shop">Shop</span>
            <span class="badge-admin">Admin</span>
          </div>
          <button class="btn-close-sidebar-mobile" (click)="closeMobileSidebar()" title="Menyuni yopish">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          <button class="btn-toggle-sidebar" (click)="toggleSidebar()" title="Menyuni kichraytirish">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </div>

        <nav class="sidebar-nav">
          <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item" (click)="closeMobileSidebar()">
            <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            <span class="nav-text">Dashboard</span>
          </a>
          <a routerLink="/admin/products" routerLinkActive="active" class="nav-item" (click)="closeMobileSidebar()">
            <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"></polyline><rect x="1" y="3" width="22" height="5"></rect><line x1="10" y1="12" x2="14" y2="12"></line></svg>
            <span class="nav-text">Mahsulotlar</span>
          </a>
          <a routerLink="/admin/categories" routerLinkActive="active" class="nav-item" (click)="closeMobileSidebar()">
            <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
            <span class="nav-text">Kategoriyalar</span>
          </a>
          <a routerLink="/admin/subcategories" routerLinkActive="active" class="nav-item" (click)="closeMobileSidebar()">
            <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
            <span class="nav-text">Subkategoriyalar</span>
          </a>
          <a routerLink="/admin/child-categories" routerLinkActive="active" class="nav-item" (click)="closeMobileSidebar()">
            <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v8M12 10H8.5c-1.5 0-3 1.5-3 3v9M12 10h3.5c1.5 0 3 1.5 3 3v9"/></svg>
            <span class="nav-text">Child Kategoriyalar</span>
          </a>
          <a routerLink="/admin/brands" routerLinkActive="active" class="nav-item" (click)="closeMobileSidebar()">
            <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M16 12a4 4 0 0 1-8 0"></path><line x1="12" y1="8" x2="12" y2="16"></line></svg>
            <span class="nav-text">Brandlar</span>
          </a>
          <a routerLink="/admin/orders" routerLinkActive="active" class="nav-item" (click)="closeMobileSidebar()">
            <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7z"></path><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"></path></svg>
            <span class="nav-text">Buyurtmalar</span>
          </a>
          <a routerLink="/admin/banner-control" routerLinkActive="active" class="nav-item" (click)="closeMobileSidebar()">
            <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
            <span class="nav-text">Bannerlar</span>
          </a>
          <a routerLink="/admin/messages" routerLinkActive="active" class="nav-item" (click)="closeMobileSidebar()">
            <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            <span class="nav-text">Xabarlar</span>
          </a>
          <a routerLink="/admin/reviews" routerLinkActive="active" class="nav-item" (click)="closeMobileSidebar()">
            <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            <span class="nav-text">Sharhlar</span>
          </a>
          <a routerLink="/admin/users" routerLinkActive="active" class="nav-item" (click)="closeMobileSidebar()">
            <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            <span class="nav-text">Foydalanuvchilar</span>
          </a>

          <div class="sidebar-divider"></div>

          <a routerLink="/" class="nav-item shop-link" (click)="closeMobileSidebar()">
            <svg class="nav-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            <span class="nav-text">Magazinga qaytish</span>
          </a>
        </nav>
      </aside>

      <!-- Sidebar Mobile Overlay Backdrop -->
      <div class="sidebar-mobile-overlay" (click)="closeMobileSidebar()"></div>

      <!-- Main Content -->
      <div class="admin-main">
        <header class="admin-top-bar glass-panel">
          <div class="bar-left">
            <button class="btn-toggle-sidebar-mobile" (click)="toggleMobileSidebar()" title="Menyuni ko'rsatish">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
            <span class="bar-title">NexShop Admin Boshqaruvi</span>
          </div>
          <div class="bar-right">
            <button (click)="toggleTheme()" class="btn-theme-toggle" title="Mavzuni o'zgartirish">
              <svg *ngIf="isDarkMode" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="18.36" x2="5.64" y2="16.92"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
              <svg *ngIf="!isDarkMode" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            </button>
            <a routerLink="/profile" class="admin-profile" *ngIf="adminName" title="Profilga kirish">
              <div class="profile-avatar">{{ adminName[0] | uppercase }}</div>
              <span class="profile-name">{{ adminName }}</span>
            </a>
            <button class="btn-logout" (click)="logout()" title="Chiqish">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </button>
          </div>
        </header>
        
        <div class="admin-content-outlet">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-wrapper {
      display: flex;
      min-height: 100vh;
      background: #f8fafc;
      color: #1e293b;
      transition: all 0.3s ease;
    }

    :host-context([data-theme="dark"]) .admin-wrapper {
      background: #0f172a;
      color: #f1f5f9;
    }

    /* Sidebar Styles */
    .admin-sidebar {
      width: 260px;
      height: 100vh;
      position: fixed;
      top: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(20px);
      border-right: 1px solid rgba(0, 0, 0, 0.06);
      z-index: 100;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      padding: 1.5rem 0;
    }

    :host-context([data-theme="dark"]) .admin-sidebar {
      background: rgba(15, 23, 42, 0.98);
      border-right: 1px solid rgba(255, 255, 255, 0.05);
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.5rem 1.5rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }

    :host-context([data-theme="dark"]) .sidebar-header {
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 1.25rem;
      font-weight: 800;
    }

    .logo-nex {
      color: #a855f7;
    }

    .logo-shop {
      color: #3b82f6;
    }

    .badge-admin {
      font-size: 0.65rem;
      font-weight: 700;
      background: rgba(168, 85, 247, 0.1);
      color: #a855f7;
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: uppercase;
      margin-left: 4px;
    }

    .btn-toggle-sidebar {
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;
      padding: 5px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .btn-toggle-sidebar:hover {
      background: rgba(0, 0, 0, 0.04);
      color: #1e293b;
    }

    :host-context([data-theme="dark"]) .btn-toggle-sidebar:hover {
      background: rgba(255, 255, 255, 0.05);
      color: #f1f5f9;
    }

    .btn-close-sidebar-mobile {
      display: none;
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;
      padding: 5px;
      border-radius: 6px;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .btn-close-sidebar-mobile:hover {
      background: rgba(0, 0, 0, 0.04);
      color: #1e293b;
    }

    :host-context([data-theme="dark"]) .btn-close-sidebar-mobile {
      color: #94a3b8;
    }

    :host-context([data-theme="dark"]) .btn-close-sidebar-mobile:hover {
      background: rgba(255, 255, 255, 0.05);
      color: #f1f5f9;
    }

    /* Sidebar Navigation */
    .sidebar-nav {
      flex: 1;
      overflow-y: auto;
      padding: 1.5rem 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .sidebar-nav::-webkit-scrollbar {
      width: 4px;
    }

    .sidebar-nav::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.05);
      border-radius: 4px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      color: #64748b;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 600;
      border-radius: 10px;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    :host-context([data-theme="dark"]) .nav-item {
      color: #94a3b8;
    }

    .nav-item:hover {
      background: rgba(168, 85, 247, 0.05);
      color: #a855f7;
    }

    .nav-item.active {
      background: linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
      color: #a855f7;
      border-left: 3px solid #a855f7;
      padding-left: calc(1rem - 3px);
    }

    .sidebar-divider {
      height: 1px;
      background: rgba(0, 0, 0, 0.05);
      margin: 1rem 0.75rem;
    }

    :host-context([data-theme="dark"]) .sidebar-divider {
      background: rgba(255, 255, 255, 0.05);
    }

    .shop-link {
      margin-top: auto;
      color: #3b82f6;
    }

    .shop-link:hover {
      background: rgba(59, 130, 246, 0.05);
      color: #2563eb;
    }

    /* Sidebar Mobile Backdrop Overlay */
    .sidebar-mobile-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 99;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }

    .admin-wrapper.mobile-open .sidebar-mobile-overlay {
      opacity: 1;
      pointer-events: auto;
    }

    /* Main Area Styles */
    .admin-main {
      flex: 1;
      margin-left: 260px;
      padding: 2rem;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      gap: 2rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Top Bar */
    .admin-top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.5rem;
      background: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(0, 0, 0, 0.06);
      border-radius: 16px;
    }

    :host-context([data-theme="dark"]) .admin-top-bar {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .bar-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .bar-title {
      font-weight: 700;
      font-size: 1.1rem;
      background: linear-gradient(135deg, #a855f7 0%, #3b82f6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .btn-toggle-sidebar-mobile {
      display: none;
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;
      padding: 5px;
      border-radius: 6px;
    }

    .bar-right {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }

    .btn-theme-toggle, .btn-logout {
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;
      padding: 8px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }

    .btn-theme-toggle:hover, .btn-logout:hover {
      background: rgba(0, 0, 0, 0.04);
      color: #1e293b;
    }

    :host-context([data-theme="dark"]) .btn-theme-toggle:hover,
    :host-context([data-theme="dark"]) .btn-logout:hover {
      background: rgba(255, 255, 255, 0.05);
      color: #f1f5f9;
    }

    .btn-logout:hover {
      color: #ef4444;
      background: rgba(239, 68, 68, 0.08);
    }

    .admin-profile {
      display: flex;
      align-items: center;
      gap: 8px;
      border-left: 1px solid rgba(0, 0, 0, 0.08);
      padding-left: 1.25rem;
      text-decoration: none;
      color: inherit;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .admin-profile:hover {
      opacity: 0.8;
      transform: translateY(-1px);
    }

    .admin-profile:hover .profile-avatar {
      box-shadow: 0 0 10px rgba(168, 85, 247, 0.4);
    }

    :host-context([data-theme="dark"]) .admin-profile {
      border-left: 1px solid rgba(255, 255, 255, 0.08);
    }

    .profile-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #a855f7 0%, #3b82f6 100%);
      color: white;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
    }

    .profile-name {
      font-weight: 600;
      font-size: 0.9rem;
    }

    .admin-content-outlet {
      flex: 1;
    }

    /* Collapsed state styles */
    .admin-wrapper.collapsed .admin-sidebar {
      width: 80px;
    }

    .admin-wrapper.collapsed .admin-sidebar .nav-text {
      display: none;
    }

    .admin-wrapper.collapsed .admin-sidebar .logo {
      display: none;
    }

    .admin-wrapper.collapsed .admin-sidebar .sidebar-header {
      justify-content: center;
      padding: 0 0 1.5rem 0;
    }

    .admin-wrapper.collapsed .admin-sidebar .nav-item {
      justify-content: center;
      padding: 0.75rem;
    }

    .admin-wrapper.collapsed .admin-sidebar .badge-admin {
      display: none;
    }

    .admin-wrapper.collapsed .admin-main {
      margin-left: 80px;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .admin-sidebar {
        width: 280px;
        transform: translateX(-100%);
        z-index: 1000;
        background: rgba(255, 255, 255, 0.98);
      }

      :host-context([data-theme="dark"]) .admin-sidebar {
        background: rgba(15, 23, 42, 0.98);
      }

      .admin-wrapper.mobile-open .admin-sidebar {
        transform: translateX(0);
      }

      .admin-main {
        margin-left: 0 !important;
        padding: 1rem;
      }

      @media (max-width: 768px) {
        .admin-main {
          padding: 0.75rem 0.5rem;
        }
        .admin-top-bar {
          position: sticky;
          top: 0.5rem;
          z-index: 99;
          border-radius: 12px;
          margin-bottom: 1rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }
      }

      .btn-toggle-sidebar-mobile {
        display: flex;
      }

      .btn-toggle-sidebar {
        display: none;
      }

      .btn-close-sidebar-mobile {
        display: flex;
      }

      .admin-wrapper.collapsed .admin-sidebar {
        transform: translateX(-100%);
        width: 280px;
      }

      .admin-wrapper.collapsed.mobile-open .admin-sidebar {
        transform: translateX(0);
      }

      .admin-wrapper.collapsed .admin-sidebar .nav-text {
        display: inline;
      }

      .admin-wrapper.collapsed .admin-sidebar .logo {
        display: flex;
      }

      .admin-wrapper.collapsed .admin-sidebar .sidebar-header {
        justify-content: space-between;
        padding: 0 1.5rem 1.5rem;
      }

      .admin-wrapper.collapsed .admin-sidebar .nav-item {
        justify-content: flex-start;
        padding: 0.75rem 1rem;
      }

      .admin-wrapper.collapsed .admin-sidebar .badge-admin {
        display: inline;
      }

      .bar-title {
        font-size: 0.95rem;
      }

      .profile-name {
        display: none;
      }

      .admin-profile {
        padding-left: 0.5rem;
        border-left: none;
      }
    }
  `]
})
export class AdminLayoutComponent implements OnInit {
  isSidebarCollapsed = false;
  isMobileSidebarOpen = false;
  isDarkMode = false;
  adminName = '';

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    this.adminName = user?.firstName || user?.username || 'Admin';
    this.themeService.theme$.subscribe(theme => {
      this.isDarkMode = theme === 'dark';
    });
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  toggleMobileSidebar(): void {
    this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
  }

  closeMobileSidebar(): void {
    this.isMobileSidebarOpen = false;
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
