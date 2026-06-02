import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="about-container fade-in-el">
      <div class="page-header text-center">
        <h1>Biz Haqimizda</h1>
        <p class="subtitle">Sifatli texnika, ishonchli xizmat</p>
      </div>

      <div class="about-grid">
        <div class="about-image-wrapper glass-panel">
          <img src="https://images.unsplash.com/photo-1491933382434-500287f9b54b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Tech Store" class="about-image">
        </div>
        
        <div class="about-content">
          <h2>Bizning Maqsadimiz</h2>
          <p>Biz eng so'nggi texnologiyalarni siz uchun qulay va hamyonbop narxlarda yetkazib berishni maqsad qilganmiz. Har bir mijozimizning mamnunligi biz uchun eng muhimi hisoblanadi.</p>
          
          <div class="features-list">
            <div class="feature-item glass-panel">
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
              </div>
              <div class="feature-text">
                <h3>Tez Yetkazib Berish</h3>
                <p>O'zbekiston bo'ylab 24 soat ichida eltib berish</p>
              </div>
            </div>
            
            <div class="feature-item glass-panel">
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <div class="feature-text">
                <h3>1 Yil Kafolat</h3>
                <p>Barcha mahsulotlarimiz kafolatlangan</p>
              </div>
            </div>

            <div class="feature-item glass-panel">
              <div class="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
              </div>
              <div class="feature-text">
                <h3>24/7 Qo'llab-quvvatlash</h3>
                <p>Savollaringiz bo'lsa har doim yordamga tayyormiz</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .about-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
      margin-bottom: 4rem;
    }

    .page-header {
      margin-bottom: 4rem;
      margin-top: 2rem;
    }

    .page-header h1 {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      background: var(--primary-gradient);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .about-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3rem;
      align-items: center;
    }

    .about-image-wrapper {
      padding: 0;
      overflow: hidden;
      border-radius: var(--border-radius-lg);
      height: 500px;
    }

    .about-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .about-image-wrapper:hover .about-image {
      transform: scale(1.05);
    }

    .about-content h2 {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 1.5rem;
      color: var(--text-primary);
    }

    .about-content p {
      font-size: 1.1rem;
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 2.5rem;
    }

    .features-list {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 1.5rem;
      transition: var(--transition-smooth);
    }

    .feature-item:hover {
      transform: translateX(10px);
      border-color: rgba(168, 85, 247, 0.3);
    }

    .feature-icon {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(236, 72, 153, 0.1));
      display: flex;
      align-items: center;
      justify-content: center;
      color: #a855f7;
      flex-shrink: 0;
    }

    .feature-text h3 {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.25rem;
    }

    .feature-text p {
      font-size: 0.9rem;
      color: var(--text-secondary);
      margin-bottom: 0;
    }

    @media (max-width: 992px) {
      .about-grid {
        grid-template-columns: 1fr;
      }
      .about-image-wrapper {
        height: 350px;
      }
    }
  `]
})
export class AboutComponent {}
