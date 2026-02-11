import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '@core/services';

@Component({
  selector: 'page-layout',
  template: '<p>Welcome, {{ user?.name }}!</p>',
})
export class LayoutComponent {
  private authService = inject(AuthService);

  user = this.authService.user;
}
