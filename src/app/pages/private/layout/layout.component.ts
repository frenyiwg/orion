import { Component, HostListener, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@core/services';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'page-layout',
  templateUrl: './layout.component.html',
  imports: [RouterOutlet, BreadcrumbsComponent, SidebarComponent],
})
export class LayoutComponent {
  sidebarOpen = signal(false);
  isUserMenuOpen = signal(false);
  authService = inject(AuthService);

  toggleSidebar() {
    this.sidebarOpen.update((v) => !v);
  }

  toggleUserMenu() {
    this.isUserMenuOpen.update((v) => !v);
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  onEsc() {
    this.closeSidebar();
  }
}
