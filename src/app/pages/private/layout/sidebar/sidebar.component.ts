import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@core/services';

@Component({
  selector: 'app-sidebar',
  templateUrl: 'sidebar.component.html',
  imports: [RouterLink, RouterLinkActive],
})
export class SidebarComponent {
  private authService = inject(AuthService);

  user = computed(() => this.authService.user);
  isUserMenuOpen = signal(false);

  toggleUserMenu() {
    this.isUserMenuOpen.update((v) => !v);
  }

  logout() {
    this.authService.logout();
    window.location.reload();
  }
}
