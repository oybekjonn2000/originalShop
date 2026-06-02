import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="not-found-container fade-in-el">
      <div class="error-code">404</div>
      <h1 class="error-title">Sahifa topilmadi</h1>
      <p class="error-desc">Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki o'chirilgan bo'lishi mumkin.</p>
      
      <div class="actions">
        <a routerLink="/" class="btn-primary">Bosh sahifaga qaytish</a>
        <a routerLink="/catalog" class="btn-secondary">Katalogni ko'rish</a>
      </div>
      
      <div class="bg-blur"></div>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      text-align: center;
      padding: 2rem;
      position: relative;
      overflow: hidden;
    }

    .error-code {
      font-size: 12rem;
      font-weight: 900;
      line-height: 1;
      background: var(--primary-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      opacity: 0.8;
      margin-bottom: 0.5rem;
      font-family: var(--font-heading);
    }

    .error-title {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 1rem;
      z-index: 1;
    }

    .error-desc {
      font-size: 1.1rem;
      color: var(--text-secondary);
      max-width: 500px;
      margin-bottom: 2.5rem;
      z-index: 1;
      line-height: 1.6;
    }

    .actions {
      display: flex;
      gap: 1rem;
      z-index: 1;
    }

    .bg-blur {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(236, 72, 153, 0) 70%);
      filter: blur(40px);
      z-index: 0;
      pointer-events: none;
    }

    @media (max-width: 600px) {
      .error-code { font-size: 8rem; }
      .error-title { font-size: 2rem; }
      .actions { flex-direction: column; width: 100%; max-width: 300px; }
      .actions > * { width: 100%; text-align: center; }
    }
  `]
})
export class NotFoundComponent {}
