import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { HeaderComponent } from './components/layout/header/header.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'NexShop';
  isPageLoading = false;
  private navSub: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.navSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isPageLoading = true;
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        setTimeout(() => {
          this.isPageLoading = false;
        }, 300);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.navSub) this.navSub.unsubscribe();
  }
}
