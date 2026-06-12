import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { OrderService } from '../../../services/order.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container fade-in-el">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1>Admin Panel</h1>
          <p class="subtitle">Xush kelibsiz, <strong>{{ adminName }}</strong>! NexShop boshqaruv paneli.</p>
        </div>
        <div class="header-time">{{ currentDate | date:'EEEE, d MMMM y' }}</div>
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
            <span class="stat-value revenue">{{ totalRevenue | number:'1.0-0' }} so'm</span>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-section" style="display: grid; grid-template-columns: 2fr 1.1fr; gap: 2rem; margin-bottom: 3rem;">
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
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; width: 100%; margin-top: 0.5rem;">
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

      <!-- Recent Orders Table -->
      <div class="recent-orders-section">
        <div class="section-header">
          <h2 class="section-title">So'nggi Buyurtmalar</h2>
          <a routerLink="/admin/orders" class="view-all-link">Barchasini ko'rish →</a>
        </div>

        <div class="glass-table-container">
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
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
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

    .stat-info {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .stat-label {
      font-size: 0.85rem;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 500;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 800;
      color: var(--text-primary);
      font-family: var(--font-heading);
      line-height: 1;
    }

    .stat-value.revenue {
      background: var(--success-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .section-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .section-header .section-title {
      margin-bottom: 0;
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

    .quick-actions-section {
      margin-bottom: 3rem;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 1.5rem;
    }

    .action-card {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 2rem;
      text-decoration: none;
      cursor: pointer;
    }

    .action-card:hover {
      transform: translateY(-5px);
    }

    .action-icon {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.25rem;
      color: #04080f;
    }

    .action-card h3 {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.35rem;
    }

    .action-card p {
      font-size: 0.85rem;
      color: var(--text-secondary);
    }

    .recent-orders-section {
      margin-bottom: 3rem;
    }

    .empty-row {
      text-align: center;
      color: var(--text-secondary) !important;
      padding: 2rem !important;
    }
  `]
})
export class DashboardComponent implements OnInit {
  totalProducts = 0;
  totalOrders = 0;
  pendingOrders = 0;
  totalRevenue = 0;
  recentOrders: any[] = [];
  adminName = '';
  currentDate = new Date();

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
    private authService: AuthService
  ) {}

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

    this.productService.getProducts().subscribe(p => {
      this.totalProducts = p.length;
    });

    this.orderService.getAllOrders().subscribe(orders => {
      this.totalOrders = orders.length;
      
      // Calculate individual counts
      this.deliveredCount = orders.filter(o => o.status === 'DELIVERED').length;
      this.processingCount = orders.filter(o => o.status === 'PROCESSING' || o.status === 'SHIPPED').length;
      this.pendingCount = orders.filter(o => o.status === 'PENDING').length;
      this.cancelledCount = orders.filter(o => o.status === 'CANCELLED').length;
      
      // Group other statuses as processing
      const matched = this.deliveredCount + this.processingCount + this.pendingCount + this.cancelledCount;
      if (matched < this.totalOrders) {
        this.processingCount += (this.totalOrders - matched);
      }

      // Calculate percentages dynamically
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

      // Set SVG sector lengths
      this.deliveredDashArray = `${this.deliveredPct} ${100 - this.deliveredPct}`;
      this.deliveredDashOffset = 0;

      this.processingDashArray = `${this.processingPct} ${100 - this.processingPct}`;
      this.processingDashOffset = -this.deliveredPct;

      this.pendingDashArray = `${this.pendingPct} ${100 - this.pendingPct}`;
      this.pendingDashOffset = -(this.deliveredPct + this.processingPct);

      this.cancelledDashArray = `${this.cancelledPct} ${100 - this.cancelledPct}`;
      this.cancelledDashOffset = -(this.deliveredPct + this.processingPct + this.pendingPct);

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

      this.pendingOrders = this.pendingCount;
      this.totalRevenue = orders
        .filter(o => o.status !== 'CANCELLED')
        .reduce((acc: number, o: any) => acc + o.totalAmount, 0);
      this.recentOrders = orders.slice(0, 8);
    });
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
