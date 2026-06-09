import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="modern-footer glass-panel">
      <!-- Glow effect for the footer -->
      <div class="footer-glow-effect"></div>
      
      <div class="footer-content">
        <!-- Brand & Description -->
        <div class="footer-brand-section">
          <h3><span class="brand-glow">Nex</span>Shop</h3>
          <p class="brand-desc">Eng so'nggi va zamonaviy texnologiyalarni kafolatlangan holda eng qulay narxlarda taqdim etamiz. Texnologiyalar olamida ishonchli hamkoringiz.</p>
          
          <div class="social-links">
            <a href="#" class="social-btn" aria-label="Telegram" title="Telegram">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-18.6 7.227c-1.346.523-1.365 2.417-.034 2.969l4.887 2.036v5.821c0 .882.802 1.488 1.579 1.18l2.914-1.155 4.542 4.195c1.096 1.012 2.871.492 3.162-.958l3.666-18.256a2.242 2.242 0 0 0-1.094-3.274Z"></path></svg>
            </a>
            <a href="#" class="social-btn" aria-label="Instagram" title="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="#" class="social-btn" aria-label="Facebook" title="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="#" class="social-btn" aria-label="YouTube" title="YouTube">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
            </a>
          </div>
        </div>

        <!-- Links Grid -->
        <div class="footer-links-grid">
          <div class="links-col">
            <h4>Kompaniya</h4>
            <ul>
              <li><a routerLink="/about">Biz haqimizda</a></li>
              <li><a routerLink="/contact">Aloqa</a></li>
              <li><a href="#">Karyera</a></li>
              <li><a href="#">Ommaviy oferta</a></li>
            </ul>
          </div>
          
          <div class="links-col">
            <h4>Xaridorlar uchun</h4>
            <ul>
              <li><a routerLink="/catalog">Katalog</a></li>
              <li><a href="#">Yetkazib berish</a></li>
              <li><a href="#">To'lov usullari</a></li>
              <li><a href="#">Kafolat va qaytarish</a></li>
            </ul>
          </div>

          <!-- Newsletter -->
          <div class="links-col newsletter-col">
            <h4>Yangiliklarga obuna</h4>
            <p>Eng so'nggi chegirmalar va yangiliklardan xabardor bo'ling.</p>
            <form class="newsletter-form" (submit)="subscribe($event)">
              <div class="input-wrapper">
                <input type="email" placeholder="Email manzilingiz" required class="glass-input" />
                <button type="submit" class="btn-subscribe" title="Obuna bo'lish">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <div class="bottom-content">
          <p>&copy; 2026 NexShop. Barcha huquqlar himoyalangan.</p>
          <div class="payment-methods">
            <span class="payment-badge">Humo</span>
            <span class="payment-badge">Uzcard</span>
            <span class="payment-badge">Visa</span>
          </div>
          <p class="developer-info">Dasturchi: <strong>Pair-AI</strong></p>
        </div>
      </div>
    </footer>

    <!-- Material Snackbar Toast -->
    <div class="mat-snackbar" [ngClass]="toastType" *ngIf="showToastNotif">
      <div class="mat-snack-icon">
        <svg *ngIf="toastType === 'snack-success'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>
      <span class="mat-snack-text">{{ toastMsg }}</span>
    </div>
  `,
  styles: [`
    .modern-footer {
      position: relative;
      margin: 4rem auto 0 auto;
      max-width: 1400px;
      width: calc(100% - 2rem);
      border-radius: 24px 24px 0 0;
      border-bottom: none;
      overflow: hidden;
      
      /* Light Theme (Default) */
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.8) 0%, rgba(240, 247, 255, 0.95) 100%);
      border: 1px solid var(--glass-border);
      border-bottom: none;
      box-shadow: 0 -10px 40px rgba(37, 99, 235, 0.05);
      transition: background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
    }

    :host-context([data-theme="dark"]) .modern-footer {
      background: linear-gradient(180deg, rgba(15, 23, 42, 0.4) 0%, rgba(10, 15, 28, 0.8) 100%);
      border-color: rgba(255, 255, 255, 0.05);
      box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.3);
    }

    .footer-glow-effect {
      position: absolute;
      top: -100px;
      right: 10%;
      width: 300px;
      height: 300px;
      
      /* Light Theme Glow */
      background: radial-gradient(circle, rgba(37, 99, 235, 0.15) 0%, transparent 70%);
      border-radius: 50%;
      filter: blur(40px);
      z-index: 0;
      pointer-events: none;
      transition: background 0.4s ease;
    }

    :host-context([data-theme="dark"]) .footer-glow-effect {
      background: radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%);
    }

    .footer-content {
      position: relative;
      z-index: 1;
      display: flex;
      justify-content: space-between;
      gap: 3rem;
      padding: 4rem 3rem 3rem;
    }

    .footer-brand-section {
      flex: 1;
      min-width: 280px;
      max-width: 350px;
    }

    .footer-brand-section h3 {
      font-size: 2rem;
      font-weight: 800;
      margin-bottom: 1rem;
      letter-spacing: -0.02em;
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
      margin-bottom: 2rem;
    }

    /* Social Links */
    .social-links {
      display: flex;
      gap: 1rem;
    }

    .social-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      color: var(--text-secondary);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .social-btn:hover {
      background: var(--primary-color);
      color: #fff;
      border-color: var(--primary-color);
      transform: translateY(-3px) scale(1.05);
      box-shadow: 0 10px 20px var(--primary-glow);
    }

    /* Links Grid */
    .footer-links-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 3rem;
      flex: 2;
      justify-content: flex-end;
    }

    .links-col {
      min-width: 140px;
    }

    .newsletter-col {
      min-width: 260px;
      flex: 1;
      max-width: 320px;
    }

    .links-col h4 {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 1.5rem;
      font-family: var(--font-heading);
    }

    .links-col ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    .links-col a {
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.95rem;
      transition: var(--transition-smooth);
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .links-col a:hover {
      color: var(--primary-color);
      transform: translateX(4px);
    }

    /* Newsletter */
    .newsletter-col p {
      color: var(--text-secondary);
      font-size: 0.9rem;
      line-height: 1.5;
      margin-bottom: 1.25rem;
    }

    .newsletter-form .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .newsletter-form input {
      width: 100%;
      padding-right: 3.5rem;
      border-radius: 12px;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      color: var(--text-primary);
      transition: var(--transition-smooth);
    }

    .newsletter-form input:focus {
      background: var(--panel-bg);
      border-color: var(--primary-color);
      outline: none;
      box-shadow: 0 0 0 3px var(--primary-glow);
    }

    .btn-subscribe {
      position: absolute;
      right: 0.35rem;
      top: 50%;
      transform: translateY(-50%);
      width: 34px;
      height: 34px;
      border-radius: 8px;
      border: none;
      background: var(--primary-gradient);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: var(--transition-smooth);
    }

    .btn-subscribe:hover {
      transform: translateY(-50%) scale(1.05);
      box-shadow: 0 0 15px var(--primary-glow);
    }

    /* Bottom */
    .footer-bottom {
      position: relative;
      z-index: 1;
      padding: 1.5rem 3rem;
      
      /* Light Theme Bottom */
      background: rgba(37, 99, 235, 0.03);
      border-top: 1px solid var(--glass-border);
      transition: background 0.4s ease, border-color 0.4s ease;
    }

    :host-context([data-theme="dark"]) .footer-bottom {
      background: rgba(0, 0, 0, 0.2);
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .bottom-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1.5rem;
    }

    .footer-bottom p {
      color: var(--text-secondary);
      font-size: 0.85rem;
      margin: 0;
    }

    .payment-methods {
      display: flex;
      gap: 0.75rem;
    }

    .payment-badge {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--text-secondary);
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      transition: var(--transition-smooth);
    }

    .developer-info strong {
      color: var(--primary-color);
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .footer-content { flex-direction: column; gap: 2.5rem; padding: 3rem 2rem 2rem; }
      .footer-brand-section { max-width: 100%; }
      .footer-links-grid { justify-content: flex-start; gap: 2.5rem; }
      .newsletter-col { max-width: 100%; }
    }

    @media (max-width: 768px) {
      .modern-footer { margin-top: 3rem; border-radius: 20px 20px 0 0; }
      .footer-links-grid { flex-direction: column; gap: 2rem; }
      .bottom-content { flex-direction: column; text-align: center; justify-content: center; }
    }

    @media (max-width: 480px) {
      .modern-footer { width: 100%; border-radius: 0; }
      .footer-content { padding: 2.5rem 1.25rem 1.5rem; }
      .footer-bottom { padding: 1.25rem; }
      .payment-methods { justify-content: center; flex-wrap: wrap; }
    }

    /* Material Snackbar Toast */
    .mat-snackbar {
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      min-width: 300px;
      max-width: 480px;
      padding: 0.9rem 1.4rem;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-weight: 600;
      font-size: 0.9rem;
      backdrop-filter: blur(16px);
      box-shadow: 0 8px 32px rgba(0,0,0,0.35);
      z-index: 99999;
      animation: snackSlideUp 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .snack-success { background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.4); color: #34d399; }
    .mat-snack-icon { display: flex; align-items: center; flex-shrink: 0; }
    .mat-snack-text { flex: 1; line-height: 1.4; }
    @keyframes snackSlideUp {
      from { opacity: 0; transform: translateX(-50%) translateY(20px); }
      to   { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
  `]
})
export class FooterComponent {
  // Toast
  showToastNotif = false;
  toastMsg = '';
  toastType: 'snack-success' = 'snack-success';
  private toastTimer: any;

  subscribe(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement;
    if (emailInput.value) {
      this.showToast("Obuna muvaffaqiyatli amalga oshirildi!");
      emailInput.value = '';
    }
  }

  showToast(message: string): void {
    clearTimeout(this.toastTimer);
    this.toastMsg = message;
    this.showToastNotif = true;
    this.toastTimer = setTimeout(() => this.showToastNotif = false, 3500);
  }
}

