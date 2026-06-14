import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { OrderService } from '../../../services/order.service';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { AuditLogService } from '../../../services/audit-log.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="dashboard-container fade-in-el">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1>Admin Panel</h1>
          <p class="subtitle">Xush kelibsiz, <strong>{{ adminName }}</strong>! NexShop boshqaruv paneli.</p>
        </div>
        <div class="header-actions" style="display: flex; align-items: center; gap: 1rem;">
          <select [(ngModel)]="selectedPeriod" (change)="applyPeriodFilter()" class="glass-select" style="padding: 0.5rem 1rem; border-radius: 8px; background: var(--glass-bg); border: 1px solid var(--glass-border); color: var(--text-primary); font-weight: 600; outline: none; cursor: pointer; font-family: var(--font-main);">
            <option value="ALL">Barcha vaqt</option>
            <option value="WEEK">Oxirgi hafta (7 kun)</option>
            <option value="MONTH">Oxirgi oy (30 kun)</option>
            <option value="YEAR">Oxirgi yil (365 kun)</option>
          </select>
          <div class="header-time">{{ currentDate | date:'EEEE, d MMMM y' }}</div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card glass-panel">
          <div class="stat-icon products-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Jami Mahsulotlar</span>
            <span class="stat-value">{{ totalProducts }}</span>
          </div>
        </div>

        <div class="stat-card glass-panel">
          <div class="stat-icon orders-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Jami Buyurtmalar</span>
            <span class="stat-value">{{ totalOrders }}</span>
          </div>
        </div>

        <div class="stat-card glass-panel">
          <div class="stat-icon pending-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Kutilayotgan</span>
            <span class="stat-value">{{ pendingOrders }}</span>
          </div>
        </div>

        <div class="stat-card glass-panel">
          <div class="stat-icon revenue-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Jami Daromad</span>
            <span class="stat-value revenue">{{ formatTotalRevenue(totalRevenue) }}</span>
            <span *ngIf="totalRevenue >= 1000000" class="stat-subvalue" style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.1rem; font-weight: 500;">
              {{ formatFullRevenue(totalRevenue) }}
            </span>
          </div>
        </div>

        <!-- New Card: AOV -->
        <div class="stat-card glass-panel">
          <div class="stat-icon aov-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">O'rtacha Buyurtma (AOV)</span>
            <span class="stat-value">{{ formatFullRevenue(aov) }}</span>
          </div>
        </div>

        <!-- New Card: Conversion Rate -->
        <div class="stat-card glass-panel">
          <div class="stat-icon conversion-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Konversiya Darajasi</span>
            <span class="stat-value">{{ conversionRate | number:'1.1-1' }}%</span>
          </div>
        </div>

        <!-- New Card: Returning Customer Rate -->
        <div class="stat-card glass-panel">
          <div class="stat-icon returning-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Sodiq Mijozlar (RCR)</span>
            <span class="stat-value">{{ returningCustomerRate | number:'1.1-1' }}%</span>
          </div>
        </div>

        <!-- New Card: Total Inventory Value -->
        <div class="stat-card glass-panel">
          <div class="stat-icon inventory-value-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Ombor Umumiy Qiymati</span>
            <span class="stat-value revenue">{{ formatTotalRevenue(totalInventoryValue) }}</span>
            <span *ngIf="totalInventoryValue >= 1000000" class="stat-subvalue" style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.1rem; font-weight: 500;">
              {{ formatFullRevenue(totalInventoryValue) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-section">
        <!-- Sales Area Chart -->
        <div class="chart-card glass-panel" style="padding: 2rem; display: flex; flex-direction: column; gap: 1rem;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3 style="margin: 0; font-size: 1.2rem; font-weight: 700;">Sotuvlar Dinamikasi (Oxirgi 6 oy)</h3>
            <span style="font-size: 0.82rem; font-weight: 600; color: #a855f7; background: rgba(168, 85, 247, 0.1); padding: 4px 10px; border-radius: 50px;">Daromad o'sishi</span>
          </div>
          <!-- SVG Line/Area Graph -->
          <div class="svg-container" style="position: relative; height: 260px; width: 100%;">
            <svg viewBox="0 0 600 240" width="100%" height="100%" preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.3"/>
                  <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.0"/>
                </linearGradient>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stop-color="#a855f7"/>
                  <stop offset="100%" stop-color="#3b82f6"/>
                </linearGradient>
              </defs>
              <!-- Grid lines -->
              <line x1="40" y1="30" x2="580" y2="30" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
              <line x1="40" y1="90" x2="580" y2="90" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
              <line x1="40" y1="150" x2="580" y2="150" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
              <line x1="40" y1="210" x2="580" y2="210" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
              
              <!-- Y Axis labels -->
              <text x="30" y="35" font-size="10" fill="var(--text-secondary)" text-anchor="end">{{ yAxisLabelTop }}</text>
              <text x="30" y="95" font-size="10" fill="var(--text-secondary)" text-anchor="end">{{ yAxisLabelMiddle }}</text>
              <text x="30" y="155" font-size="10" fill="var(--text-secondary)" text-anchor="end">{{ yAxisLabelLower }}</text>
              <text x="30" y="215" font-size="10" fill="var(--text-secondary)" text-anchor="end">0</text>
              
              <!-- X Axis labels (Months) -->
              <text *ngFor="let p of salesTrendPoints" [attr.x]="p.x" y="235" font-size="11" fill="var(--text-secondary)" text-anchor="middle">{{ p.name }}</text>
              
              <!-- Area -->
              <path *ngIf="salesTrendAreaPath" [attr.d]="salesTrendAreaPath" fill="url(#areaGradient)"/>
              
              <!-- Line -->
              <path *ngIf="salesTrendLinePath" [attr.d]="salesTrendLinePath" fill="none" stroke="url(#lineGradient)" stroke-width="3.5" stroke-linecap="round"/>
              
              <!-- Data Points -->
              <circle *ngFor="let p of salesTrendPoints; let idx = index" [attr.cx]="p.x" [attr.cy]="p.y" r="5" [attr.fill]="idx % 2 === 0 ? '#a855f7' : '#3b82f6'" stroke="#fff" stroke-width="2">
                <title>{{ p.name }}: {{ p.revenue | number:'1.0-0' }} so'm</title>
              </circle>
            </svg>
          </div>
        </div>

        <!-- Order Status Donut Chart -->
        <div class="chart-card glass-panel" style="padding: 2rem; display: flex; flex-direction: column; gap: 1rem; align-items: center; justify-content: center;">
          <h3 style="margin: 0; font-size: 1.2rem; font-weight: 700; align-self: flex-start;">Buyurtmalar Statusi</h3>
          
          <div style="position: relative; width: 160px; height: 160px;">
            <svg width="100%" height="100%" viewBox="0 0 42 42" style="transform: rotate(-90deg);">
              <!-- Donut background -->
              <circle cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="rgba(255,255,255,0.06)" stroke-width="3.5"></circle>
              <!-- Delivered (Green) -->
              <circle *ngIf="deliveredPct > 0" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#10b981" stroke-width="4" [attr.stroke-dasharray]="deliveredDashArray" [attr.stroke-dashoffset]="deliveredDashOffset"></circle>
              <!-- Processing/Shipped (Blue) -->
              <circle *ngIf="processingPct > 0" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#3b82f6" stroke-width="4" [attr.stroke-dasharray]="processingDashArray" [attr.stroke-dashoffset]="processingDashOffset"></circle>
              <!-- Pending (Orange) -->
              <circle *ngIf="pendingPct > 0" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#f59e0b" stroke-width="4" [attr.stroke-dasharray]="pendingDashArray" [attr.stroke-dashoffset]="pendingDashOffset"></circle>
              <!-- Cancelled (Red) -->
              <circle *ngIf="cancelledPct > 0" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#ef4444" stroke-width="4" [attr.stroke-dasharray]="cancelledDashArray" [attr.stroke-dashoffset]="cancelledDashOffset"></circle>
            </svg>
            <div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;">
              <span style="font-size: 1.5rem; font-weight: 800; font-family: var(--font-heading); color: var(--text-primary);">{{ totalOrders }}</span>
              <span style="font-size: 0.72rem; color: var(--text-secondary); text-transform: uppercase; font-weight: 600; letter-spacing: 0.05em;">Jami</span>
            </div>
          </div>
          
          <div class="donut-legend-grid">
            <div style="display: flex; align-items: center; gap: 6px; font-size: 0.82rem;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #10b981; display: inline-block;"></span>
              <span style="color: var(--text-secondary);">Yetkazilgan: {{ deliveredPct }}% ({{ deliveredCount }})</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px; font-size: 0.82rem;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #3b82f6; display: inline-block;"></span>
              <span style="color: var(--text-secondary);">Jarayonda: {{ processingPct }}% ({{ processingCount }})</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px; font-size: 0.82rem;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #f59e0b; display: inline-block;"></span>
              <span style="color: var(--text-secondary);">Kutilayotgan: {{ pendingPct }}% ({{ pendingCount }})</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px; font-size: 0.82rem;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #ef4444; display: inline-block;"></span>
              <span style="color: var(--text-secondary);">Bekor qilingan: {{ cancelledPct }}% ({{ cancelledCount }})</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Analytics Section -->
      <div class="analytics-grid">
        <!-- Top Selling Products & Brands -->
        <div class="card glass-panel" style="padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3 style="margin: 0; font-size: 1.2rem; font-weight: 700;">Eng Ko'p Sotilgan Mahsulotlar</h3>
            <span style="font-size: 0.82rem; font-weight: 600; color: #10b981; background: rgba(16, 185, 129, 0.1); padding: 4px 10px; border-radius: 50px;">Top 5</span>
          </div>
          <div class="glass-table-container">
            <table class="glass-table">
              <thead>
                <tr>
                  <th>Mahsulot</th>
                  <th style="text-align: center;">Sotilgan</th>
                  <th style="text-align: right;">Jami Summa</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of topSellingProducts">
                  <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                      <img [src]="item.product.imageUrl || 'assets/placeholder.png'" style="width: 36px; height: 36px; border-radius: 6px; object-fit: cover; border: 1px solid var(--glass-border);" />
                      <div>
                        <div style="font-weight: 600; font-size: 0.9rem; color: var(--text-primary); text-align: left;">{{ item.product.name }}</div>
                        <div style="font-size: 0.75rem; color: var(--text-secondary); text-align: left;">{{ item.product.brand?.name || 'No Brand' }}</div>
                      </div>
                    </div>
                  </td>
                  <td style="text-align: center; font-weight: 600;">{{ item.quantity }} ta</td>
                  <td style="text-align: right; font-weight: 700; color: var(--primary-color);">{{ item.revenue | number:'1.0-0' }} so'm</td>
                </tr>
                <tr *ngIf="topSellingProducts.length === 0">
                  <td colspan="3" class="empty-row">Sotuvlar mavjud emas</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Low Stock Alerts -->
        <div class="card glass-panel" style="padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h3 style="margin: 0; font-size: 1.2rem; font-weight: 700;">Zaxira Ogohlantirishlari (Kam qolgan)</h3>
            <span class="stock-alert-badge" [class.danger]="lowStockProducts.length > 0">{{ lowStockProducts.length }} ta mahsulot</span>
          </div>
          <div class="stock-alerts-list" style="display: flex; flex-direction: column; gap: 1rem; max-height: 280px; overflow-y: auto;">
            <div *ngFor="let item of lowStockProducts" class="stock-alert-item" style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--glass-border); border-radius: 8px;">
              <div style="display: flex; flex-direction: column; gap: 2px; text-align: left;">
                <span style="font-weight: 600; font-size: 0.9rem; color: var(--text-primary);">{{ item.name }}</span>
                <span style="font-size: 0.75rem; color: var(--text-secondary);">ID: {{ item.id }} | {{ item.brand?.name || 'No Brand' }}</span>
              </div>
              <span class="stock-qty-badge" [class.danger]="item.stockQuantity === 0" [class.warning]="item.stockQuantity > 0 && item.stockQuantity < 5">
                {{ item.stockQuantity }} dona qoldi
              </span>
            </div>
            <div *ngIf="lowStockProducts.length === 0" class="empty-alerts" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 0.5rem;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              <p style="font-size: 0.85rem; font-weight: 500;">Barcha mahsulotlar zaxirasi yetarli</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Tabs Section (Recent Orders, Audit Logs, Customer Regions) -->
      <div class="bottom-tabs-section glass-panel" style="padding: 2rem; margin-bottom: 3rem; display: flex; flex-direction: column; gap: 1.5rem;">
        <div class="tabs-header-wrapper" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--glass-border); padding-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
          <div class="tabs-header" style="display: flex; gap: 1rem;">
            <button [class.active]="activeTab === 'orders'" (click)="activeTab = 'orders'" class="tab-btn">So'nggi Buyurtmalar</button>
            <button [class.active]="activeTab === 'logs'" (click)="activeTab = 'logs'" class="tab-btn">Audit Jurnali (Admin faolligi)</button>
            <button [class.active]="activeTab === 'regions'" (click)="activeTab = 'regions'" class="tab-btn">Xaridorlar Geografiyasi</button>
          </div>
          <a *ngIf="activeTab === 'orders'" routerLink="/admin/orders" class="view-all-link" style="font-size: 0.85rem;">Barcha buyurtmalarni ko'rish →</a>
        </div>

        <!-- Tab Content 1: Orders -->
        <div *ngIf="activeTab === 'orders'" class="glass-table-container">
          <table class="glass-table">
            <thead>
              <tr>
                <th>Buyurtma ID</th>
                <th>Foydalanuvchi</th>
                <th>Sana</th>
                <th>Jami</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let order of recentOrders">
                <td><strong>#{{ order.id }}</strong></td>
                <td>{{ order.user?.username }}</td>
                <td>{{ order.orderDate | date:'dd.MM.yy HH:mm' }}</td>
                <td><strong>{{ order.totalAmount | number:'1.0-0' }} so'm</strong></td>
                <td>
                  <span class="badge" [ngClass]="getStatusClass(order.status)">{{ order.status }}</span>
                </td>
              </tr>
              <tr *ngIf="recentOrders.length === 0">
                <td colspan="5" class="empty-row">Hali buyurtmalar mavjud emas</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Tab Content 2: Audit Logs -->
        <div *ngIf="activeTab === 'logs'" class="glass-table-container">
          <table class="glass-table">
            <thead>
              <tr>
                <th>Sana</th>
                <th>Admin</th>
                <th>Amal (Action)</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let log of auditLogs">
                <td>{{ log.timestamp | date:'dd.MM.yy HH:mm:ss' }}</td>
                <td><strong style="color: var(--primary-color);">{{ log.adminUsername }}</strong></td>
                <td>{{ log.action }}</td>
              </tr>
              <tr *ngIf="auditLogs.length === 0">
                <td colspan="3" class="empty-row">Audit yozuvlari mavjud emas</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Tab Content 3: Customer Regions -->
        <div *ngIf="activeTab === 'regions'" class="glass-table-container">
          <table class="glass-table">
            <thead>
              <tr>
                <th>Hudud / Shahar</th>
                <th style="text-align: center;">Buyurtmalar Soni</th>
                <th style="text-align: right;">Umumiy Savdo</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let reg of customerRegions">
                <td><strong>{{ reg.name }}</strong></td>
                <td style="text-align: center;">{{ reg.count }} ta</td>
                <td style="text-align: right; font-weight: 700; color: var(--success-color);">{{ reg.revenue | number:'1.0-0' }} so'm</td>
              </tr>
              <tr *ngIf="customerRegions.length === 0">
                <td colspan="3" class="empty-row">Geografik ma'lumotlar mavjud emas</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 1rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2.5rem;
    }

    .page-header h1 {
      font-size: 2.5rem;
      font-weight: 800;
      background: var(--primary-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 0.35rem;
    }

    .subtitle {
      color: var(--text-secondary);
      font-size: 1rem;
    }

    .subtitle strong {
      color: var(--text-primary);
    }

    .header-time {
      color: var(--text-secondary);
      font-size: 0.9rem;
      background: rgba(255,255,255,0.03);
      border: 1px solid var(--glass-border);
      padding: 0.5rem 1rem;
      border-radius: 8px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .stat-card {
      padding: 2rem;
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .products-icon { background: rgba(79, 172, 254, 0.15); color: #4facfe; }
    .orders-icon { background: rgba(168, 85, 247, 0.15); color: #a855f7; }
    .pending-icon { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
    .revenue-icon { background: rgba(16, 185, 129, 0.15); color: #10b981; }
    .aov-icon { background: rgba(139, 92, 246, 0.15); color: #8b5cf6; }
    .conversion-icon { background: rgba(236, 72, 153, 0.15); color: #ec4899; }
    .returning-icon { background: rgba(20, 184, 166, 0.15); color: #14b8a6; }
    .inventory-value-icon { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }

    .stat-info {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      text-align: left;
    }

    .stat-label {
      font-size: 0.85rem;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 500;
    }

    .stat-value {
      font-size: 1.8rem;
      font-weight: 800;
      color: var(--text-primary);
      font-family: var(--font-heading);
      line-height: 1;
      white-space: nowrap;
    }

    .stat-value.revenue {
      background: var(--success-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .section-title {
      font-size: 1.3rem;
      font-weight: 700;
      color: var(--text-primary);
    }

    .view-all-link {
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      transition: var(--transition-smooth);
    }

    .view-all-link:hover {
      text-decoration: underline;
    }

    .empty-row {
      text-align: center;
      color: var(--text-secondary) !important;
      padding: 2rem !important;
    }

    .charts-section {
      display: grid;
      grid-template-columns: 2fr 1.1fr;
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .analytics-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .donut-legend-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px 16px;
      width: 100%;
      margin-top: 0.5rem;
    }

    .tab-btn {
      background: transparent;
      border: none;
      color: var(--text-secondary);
      font-family: var(--font-heading);
      font-weight: 600;
      font-size: 0.95rem;
      padding: 0.5rem 1rem;
      cursor: pointer;
      border-radius: 6px;
      transition: var(--transition-smooth);
    }

    .tab-btn:hover {
      color: var(--text-primary);
      background: rgba(255, 255, 255, 0.03);
    }

    .tab-btn.active {
      color: var(--primary-color);
      background: rgba(79, 172, 254, 0.1);
    }

    .stock-qty-badge {
      font-size: 0.8rem;
      font-weight: 700;
      padding: 4px 8px;
      border-radius: 50px;
    }

    .stock-qty-badge.danger {
      background: rgba(239, 68, 68, 0.15);
      color: #ef4444;
    }

    .stock-qty-badge.warning {
      background: rgba(245, 158, 11, 0.15);
      color: #f59e0b;
    }

    .stock-alert-badge {
      font-size: 0.8rem;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 50px;
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-secondary);
    }

    .stock-alert-badge.danger {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
    }

    @media (max-width: 1024px) {
      .page-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }
      .page-header h1 {
        font-size: 2rem;
      }
      .charts-section, .analytics-grid {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      .stat-card {
        padding: 1.25rem;
        gap: 1rem;
      }
      .stat-value {
        font-size: 1.6rem;
      }
      .donut-legend-grid {
        grid-template-columns: 1fr;
        gap: 8px;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  selectedPeriod = 'ALL';
  allOrders: any[] = [];
  allUsers: any[] = [];
  allProducts: any[] = [];
  auditLogs: any[] = [];

  totalProducts = 0;
  totalOrders = 0;
  pendingOrders = 0;
  totalRevenue = 0;
  recentOrders: any[] = [];
  adminName = '';
  currentDate = new Date();

  // Advanced Analytics Metrics
  aov = 0;
  conversionRate = 0;
  returningCustomerRate = 0;
  totalInventoryValue = 0;
  newUsers = 0;
  topSellingProducts: any[] = [];
  topCategories: any[] = [];
  topBrands: any[] = [];
  lowStockProducts: any[] = [];
  customerRegions: any[] = [];
  activeTab: 'orders' | 'logs' | 'regions' = 'orders';

  // Donut chart status counts
  deliveredCount = 0;
  processingCount = 0;
  pendingCount = 0;
  cancelledCount = 0;

  // Donut chart status percentages
  deliveredPct = 0;
  processingPct = 0;
  pendingPct = 0;
  cancelledPct = 0;

  // Donut chart SVG rendering dash parameters
  deliveredDashArray = '0 100';
  deliveredDashOffset = 0;
  processingDashArray = '0 100';
  processingDashOffset = 0;
  pendingDashArray = '0 100';
  pendingDashOffset = 0;
  cancelledDashArray = '0 100';
  cancelledDashOffset = 0;

  // Sales trend chart parameters
  salesTrendPoints: { x: number; y: number; name: string; revenue: number }[] = [];
  salesTrendLinePath = '';
  salesTrendAreaPath = '';
  yAxisLabelTop = '20M';
  yAxisLabelMiddle = '10M';
  yAxisLabelLower = '5M';

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private authService: AuthService,
    private userService: UserService,
    private auditLogService: AuditLogService
  ) {}

  formatTotalRevenue(val: number): string {
    if (!val) return "0 so'm";
    if (val >= 1000000) {
      return Math.floor(val / 1000000).toLocaleString() + " mln so'm";
    }
    return val.toLocaleString() + " so'm";
  }

  formatFullRevenue(val: number): string {
    if (!val) return "0 so'm";
    return val.toLocaleString() + " so'm";
  }

  formatShortRevenue(val: number): string {
    if (val >= 1000000) {
      return (val / 1000000).toFixed(1).replace('.0', '') + 'M';
    }
    if (val >= 1000) {
      return (val / 1000).toFixed(1).replace('.0', '') + 'K';
    }
    return val.toString();
  }

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    this.adminName = user?.firstName || user?.username || 'Admin';

    // Fetch users
    this.userService.getAllUsers().subscribe(users => {
      this.allUsers = users;
      this.applyPeriodFilter();
    });

    // Fetch products
    this.productService.getProducts().subscribe(products => {
      this.allProducts = products;
      this.totalProducts = products.length;
      this.calculateInventoryMetrics();
    });

    // Fetch audit logs
    this.auditLogService.getAuditLogs().subscribe(logs => {
      this.auditLogs = logs;
    });

    // Fetch orders and setup chart
    this.orderService.getAllOrders().subscribe(orders => {
      this.allOrders = orders;
      
      // --- Calculate Sales Trend Dynamics dynamically ---
      const MONTH_NAMES_UZ = [
        'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
        'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
      ];
      const now = new Date();
      const monthsData: { year: number; month: number; name: string; revenue: number }[] = [];
      
      // Get last 6 months in chronological order
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        monthsData.push({
          year: d.getFullYear(),
          month: d.getMonth(),
          name: MONTH_NAMES_UZ[d.getMonth()],
          revenue: 0
        });
      }

      // Aggregate revenue (excluding cancelled orders)
      orders.forEach((o: any) => {
        if (o.status === 'CANCELLED') return;
        const orderDate = new Date(o.orderDate);
        const year = orderDate.getFullYear();
        const month = orderDate.getMonth();
        const matchedMonth = monthsData.find(m => m.year === year && m.month === month);
        if (matchedMonth) {
          matchedMonth.revenue += o.totalAmount;
        }
      });

      // Calculate SVG Coordinates for line and area paths
      const xCoords = [75, 175, 275, 375, 475, 560];
      const maxRevenue = Math.max(...monthsData.map(m => m.revenue), 1000000); // base of 1M to avoid division by 0

      this.salesTrendPoints = monthsData.map((mData, idx) => {
        const x = xCoords[idx];
        const ratio = mData.revenue / maxRevenue;
        const y = 210 - (ratio * 180); // Y ranges from 30 (max) to 210 (base 0)
        return {
          x,
          y,
          name: mData.name,
          revenue: mData.revenue
        };
      });

      // Generate paths
      this.salesTrendLinePath = this.salesTrendPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
      this.salesTrendAreaPath = `M ${this.salesTrendPoints[0].x} 210 ` + this.salesTrendPoints.map(p => `L ${p.x} ${p.y}`).join(' ') + ` L ${this.salesTrendPoints[this.salesTrendPoints.length - 1].x} 210 Z`;

      // Set Y-axis labels dynamically
      this.yAxisLabelTop = this.formatShortRevenue(maxRevenue);
      this.yAxisLabelMiddle = this.formatShortRevenue(maxRevenue * 2 / 3);
      this.yAxisLabelLower = this.formatShortRevenue(maxRevenue / 3);

      this.applyPeriodFilter();
    });
  }

  calculateInventoryMetrics(): void {
    const activeProducts = this.allProducts.filter(p => p.isActive);
    this.totalInventoryValue = activeProducts.reduce((acc, p) => acc + (p.price * p.stockQuantity), 0);
    this.lowStockProducts = activeProducts.filter(p => p.stockQuantity < 5);
  }

  applyPeriodFilter(): void {
    const now = new Date();
    let filteredOrders = this.allOrders;

    if (this.selectedPeriod === 'WEEK') {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredOrders = this.allOrders.filter(o => new Date(o.orderDate) >= oneWeekAgo);
    } else if (this.selectedPeriod === 'MONTH') {
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filteredOrders = this.allOrders.filter(o => new Date(o.orderDate) >= oneMonthAgo);
    } else if (this.selectedPeriod === 'YEAR') {
      const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      filteredOrders = this.allOrders.filter(o => new Date(o.orderDate) >= oneYearAgo);
    }

    this.totalOrders = filteredOrders.length;
    
    this.deliveredCount = filteredOrders.filter(o => o.status === 'DELIVERED').length;
    this.processingCount = filteredOrders.filter(o => o.status === 'PROCESSING' || o.status === 'SHIPPED').length;
    this.pendingCount = filteredOrders.filter(o => o.status === 'PENDING').length;
    this.cancelledCount = filteredOrders.filter(o => o.status === 'CANCELLED').length;
    
    const matched = this.deliveredCount + this.processingCount + this.pendingCount + this.cancelledCount;
    if (matched < this.totalOrders) {
      this.processingCount += (this.totalOrders - matched);
    }

    if (this.totalOrders > 0) {
      this.deliveredPct = Math.round((this.deliveredCount / this.totalOrders) * 100);
      this.processingPct = Math.round((this.processingCount / this.totalOrders) * 100);
      this.pendingPct = Math.round((this.pendingCount / this.totalOrders) * 100);
      this.cancelledPct = 100 - (this.deliveredPct + this.processingPct + this.pendingPct);
      if (this.cancelledPct < 0) this.cancelledPct = 0;
    } else {
      this.deliveredPct = 0;
      this.processingPct = 0;
      this.pendingPct = 0;
      this.cancelledPct = 0;
    }

    this.deliveredDashArray = `${this.deliveredPct} ${100 - this.deliveredPct}`;
    this.deliveredDashOffset = 0;

    this.processingDashArray = `${this.processingPct} ${100 - this.processingPct}`;
    this.processingDashOffset = -this.deliveredPct;

    this.pendingDashArray = `${this.pendingPct} ${100 - this.pendingPct}`;
    this.pendingDashOffset = -(this.deliveredPct + this.processingPct);

    this.cancelledDashArray = `${this.cancelledPct} ${100 - this.cancelledPct}`;
    this.cancelledDashOffset = -(this.deliveredPct + this.processingPct + this.pendingPct);

    this.pendingOrders = this.pendingCount;
    this.totalRevenue = filteredOrders
      .filter(o => o.status !== 'CANCELLED')
      .reduce((acc: number, o: any) => acc + o.totalAmount, 0);
    this.recentOrders = filteredOrders.slice(0, 8);

    // Calculate AOV
    const nonCancelled = filteredOrders.filter(o => o.status !== 'CANCELLED');
    this.aov = nonCancelled.length > 0 ? (this.totalRevenue / nonCancelled.length) : 0;

    // Calculate Conversion Rate
    const uniqueUsersWithOrders = new Set(filteredOrders.map(o => o.user?.id).filter(id => id != null)).size;
    this.conversionRate = this.allUsers.length > 0 ? (uniqueUsersWithOrders / this.allUsers.length) * 100 : 0;

    // Calculate Returning Customer Rate (RCR)
    const userOrderCounts = new Map<number, number>();
    filteredOrders.forEach(o => {
      if (o.user?.id) {
        userOrderCounts.set(o.user.id, (userOrderCounts.get(o.user.id) || 0) + 1);
      }
    });
    let usersWithOneOrMore = 0;
    let usersWithTwoOrMore = 0;
    userOrderCounts.forEach(count => {
      if (count >= 1) usersWithOneOrMore++;
      if (count >= 2) usersWithTwoOrMore++;
    });
    this.returningCustomerRate = usersWithOneOrMore > 0 ? (usersWithTwoOrMore / usersWithOneOrMore) * 100 : 0;

    // Top Selling Products
    const productMap = new Map<number, { product: any; quantity: number; revenue: number }>();
    filteredOrders.forEach(o => {
      if (o.status === 'CANCELLED') return;
      if (o.orderItems) {
        o.orderItems.forEach((item: any) => {
          if (item.product) {
            const prodId = item.product.id;
            const current = productMap.get(prodId) || { product: item.product, quantity: 0, revenue: 0 };
            current.quantity += item.quantity;
            current.revenue += item.price * item.quantity;
            productMap.set(prodId, current);
          }
        });
      }
    });
    this.topSellingProducts = Array.from(productMap.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // Customer Regions
    const regionMap = new Map<string, { name: string; count: number; revenue: number }>();
    filteredOrders.forEach(o => {
      let region = 'Noma\'lum';
      if (o.shippingAddress) {
        const parts = o.shippingAddress.split(',');
        region = parts[0].trim();
      }
      const current = regionMap.get(region) || { name: region, count: 0, revenue: 0 };
      current.count++;
      if (o.status !== 'CANCELLED') {
        current.revenue += o.totalAmount;
      }
      regionMap.set(region, current);
    });
    this.customerRegions = Array.from(regionMap.values())
      .sort((a, b) => b.count - a.count);

    // New Users
    let newUsersCount = 0;
    if (this.selectedPeriod === 'WEEK') {
      const limit = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      newUsersCount = this.allUsers.filter(u => u.createdAt && new Date(u.createdAt) >= limit).length;
    } else if (this.selectedPeriod === 'MONTH') {
      const limit = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      newUsersCount = this.allUsers.filter(u => u.createdAt && new Date(u.createdAt) >= limit).length;
    } else if (this.selectedPeriod === 'YEAR') {
      const limit = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      newUsersCount = this.allUsers.filter(u => u.createdAt && new Date(u.createdAt) >= limit).length;
    } else {
      newUsersCount = this.allUsers.length;
    }
    this.newUsers = newUsersCount;
  }

  getStatusClass(status: string): string {
    const map: Record<string, string> = {
      'PENDING': 'badge-pending',
      'PROCESSING': 'badge-processing',
      'SHIPPED': 'badge-shipped',
      'DELIVERED': 'badge-delivered',
      'CANCELLED': 'badge-cancelled'
    };
    return map[status] || 'badge-pending';
  }
}
