import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="success-container fade-in-el">
      <div class="success-card glass-panel text-center">
        <div class="success-icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="success-icon"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
        </div>
        
        <h1>Buyurtmangiz qabul qilindi!</h1>
        <p class="subtitle">Xaridingiz uchun tashakkur. Biz buyurtmangizni tez orada ko'rib chiqamiz va yetkazib berish jarayonini boshlaymiz.</p>
        
        <div class="success-actions">
          <a routerLink="/orders" class="btn-secondary">Buyurtmalarni ko'rish</a>
          <a routerLink="/catalog" class="btn-primary">Yana xarid qilish</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .success-container {
      max-width: 600px;
      margin: 4rem auto;
      padding: 0 1rem;
    }

    .success-card {
      padding: 4rem 3rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }

    .success-icon-wrapper {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05));
      border: 2px solid rgba(16, 185, 129, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 2rem;
      color: #10b981;
    }

    .success-card h1 {
      font-size: 2.2rem;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 1rem;
    }

    .subtitle {
      font-size: 1.1rem;
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 2.5rem;
    }

    .success-actions {
      display: flex;
      gap: 1rem;
      width: 100%;
    }

    .success-actions > * {
      flex: 1;
      text-align: center;
    }

    @media (max-width: 600px) {
      .success-actions {
        flex-direction: column;
      }
    }
  `]
})
export class OrderSuccessComponent {}
