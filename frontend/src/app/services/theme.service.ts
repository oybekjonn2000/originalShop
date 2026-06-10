import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY      = 'nexshop_theme';
  private readonly OVERRIDE_KEY     = 'nexshop_theme_override';
  private readonly LIGHT_START_HOUR = 7;   // 07:00
  private readonly DARK_START_HOUR  = 19;  // 19:00

  private themeSubject = new BehaviorSubject<Theme>(this.resolveInitialTheme());
  theme$ = this.themeSubject.asObservable();

  private autoCheckInterval: any;

  constructor() {
    this.applyTheme(this.themeSubject.value);
    this.startAutoCheck();
  }

  get currentTheme(): Theme {
    return this.themeSubject.value;
  }

  get isDark(): boolean {
    return this.themeSubject.value === 'dark';
  }

  /** Tugmadan bosilganda — foydalanuvchi qo'lda override qiladi */
  toggleTheme(): void {
    const newTheme: Theme = this.themeSubject.value === 'light' ? 'dark' : 'light';
    localStorage.setItem(this.OVERRIDE_KEY, newTheme);
    localStorage.setItem(this.STORAGE_KEY, newTheme);
    this.themeSubject.next(newTheme);
    this.applyTheme(newTheme);
  }

  setTheme(theme: Theme): void {
    this.themeSubject.next(theme);
    this.applyTheme(theme);
    localStorage.setItem(this.STORAGE_KEY, theme);
  }

  /** Soatga qarab kerakli themeni qaytaradi: 7-19 = light, qolgan vaqt = dark */
  getTimeBasedTheme(): Theme {
    const hour = new Date().getHours();
    return (hour >= this.LIGHT_START_HOUR && hour < this.DARK_START_HOUR) ? 'light' : 'dark';
  }

  /** Foydalanuvchi qo'lda o'zgartirganmi */
  hasUserOverride(): boolean {
    return localStorage.getItem(this.OVERRIDE_KEY) !== null;
  }

  /** Override'ni bekor qilib vaqt rejimiga qaytaradi */
  resetToAutoTheme(): void {
    localStorage.removeItem(this.OVERRIDE_KEY);
    const auto = this.getTimeBasedTheme();
    localStorage.setItem(this.STORAGE_KEY, auto);
    this.themeSubject.next(auto);
    this.applyTheme(auto);
  }

  // ─── Private ────────────────────────────────────────────────

  private resolveInitialTheme(): Theme {
    const override = localStorage.getItem(this.OVERRIDE_KEY) as Theme | null;
    if (override === 'light' || override === 'dark') {
      return override;
    }
    return this.getTimeBasedTheme();
  }

  /**
   * Keyingi soat boshida va keyin har soatda tekshiradi.
   * Override bo'lmasa — vaqtga qarab o'zgartiradi.
   */
  private startAutoCheck(): void {
    const now = new Date();
    const msToNextHour =
      (60 - now.getMinutes()) * 60_000 - now.getSeconds() * 1_000;

    setTimeout(() => {
      this.checkAndApplyTimeTheme();
      this.autoCheckInterval = setInterval(() => {
        this.checkAndApplyTimeTheme();
      }, 60 * 60 * 1_000);
    }, msToNextHour);
  }

  private checkAndApplyTimeTheme(): void {
    if (this.hasUserOverride()) return;   // foydalanuvchi o'zgartirgan — tegmaymiz

    const auto = this.getTimeBasedTheme();
    if (auto !== this.themeSubject.value) {
      localStorage.setItem(this.STORAGE_KEY, auto);
      this.themeSubject.next(auto);
      this.applyTheme(auto);
    }
  }

  private applyTheme(theme: Theme): void {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
  }
}
