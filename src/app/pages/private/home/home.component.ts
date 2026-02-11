import { Component, computed, inject } from '@angular/core';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'home',
  templateUrl: 'home.component.html',
})
export class HomeComponent {
  private authService = inject(AuthService);
  user = computed(() => this.authService.user);

  get greetingTime() {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      return 'Buenos días';
    } else if (currentHour < 18) {
      return 'Buenas tardes';
    } else {
      return 'Buenas noches';
    }
  }
}
