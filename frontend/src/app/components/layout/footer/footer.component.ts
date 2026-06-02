import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer-container glass-panel">
      <div class="footer-content">
        <div class="footer-brand">
          <h3><span class="brand-glow">Nex</span>Shop</h3>
          <p class="brand-desc">Eng so'nggi va zamonaviy texnologiyalarni kafolatlangan holda eng qulay narxlarda taqdim etamiz.</p>
        </div>
        
        <div class="footer-links-section">
          <div class="links-col">
            <h4>Sahifalar</h4>
            <a routerLink="/">Asosiy</a>
            <a routerLink="/catalog">Katalog</a>
            <a routerLink="/about">Biz haqimizda</a>
            <a routerLink="/contact">Aloqa</a>
          </div>
          <div class="links-col">
            <h4>Aloqa</h4>
            <p>Email: support&#64;nexshop.uz</p>
            <p>Telefon: +998 71 123-45-67</p>
            <p>Manzil: Toshkent shahar, Chilonzor 1-kvartal</p>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2026 NexShop E-Commerce. Barcha huquqlar himoyalangan. Dasturchi: Pair-AI</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer-container {
      margin: 3rem auto 0 auto;
      max-width: 1400px;
      width: calc(100% - 2rem);
      padding: 3rem 2rem 1.5rem 2rem;
      border-radius: 16px 16px 0 0;
      border-bottom: none;
    }

    .footer-content {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 2.5rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid var(--glass-border);
    }

    .footer-brand {
      flex: 1;
      min-width: 280px;
      max-width: 400px;
    }

    .footer-brand h3 {
      font-size: 1.5rem;
      font-weight: 800;
      margin-bottom: 1rem;
    }

    .brand-glow {
      background: var(--primary-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .brand-desc {
      color: var(--text-secondary);
      font-size: 0.95rem;
      line-height: 1.6;
    }

    .footer-links-section {
      display: flex;
      gap: 4rem;
      flex-wrap: wrap;
    }

    .links-col h4 {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 1.25rem;
    }

    .links-col a {
      display: block;
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.95rem;
      margin-bottom: 0.75rem;
      transition: var(--transition-smooth);
    }

    .links-col a:hover {
      color: var(--primary-color);
      transform: translateX(3px);
    }

    .links-col p {
      color: var(--text-secondary);
      font-size: 0.95rem;
      margin-bottom: 0.75rem;
    }

    .footer-bottom {
      padding-top: 1.5rem;
      text-align: center;
      color: var(--text-secondary);
      font-size: 0.85rem;
    }

    @media (max-width: 768px) {
      .footer-container { padding: 2rem 1.25rem 1.25rem; width: calc(100% - 1rem); }
      .footer-content { flex-direction: column; gap: 1.5rem; }
      .footer-brand { min-width: 100%; max-width: 100%; }
      .footer-links-section { gap: 1.5rem; width: 100%; flex-wrap: wrap; }
    }

    @media (max-width: 480px) {
      .footer-container { width: 100%; border-radius: 0; }
      .footer-links-section { flex-direction: column; gap: 1rem; }
      .footer-bottom { font-size: 0.78rem; }
    }
  `]
})
export class FooterComponent {}
