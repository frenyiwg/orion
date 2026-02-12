import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormField, pattern, required } from '@angular/forms/signals';
import { AuthService } from '@core/services';
import { EMAIL_REGEX, TokenManager } from '@core/utils';
import { delay, finalize } from 'rxjs';

interface LoginData {
  email: string;
  password: string;
}

@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
  imports: [CommonModule, FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly authService = inject(AuthService);

  isLoading = signal(false);
  loginError = signal<string | null>(null);

  loginModel = signal<LoginData>({
    email: '',
    password: '',
  });

  loginForm = form(this.loginModel, (path) => {
    (required(path.email, { message: 'El correo electrónico es obligatorio' }),
      pattern(path.email, EMAIL_REGEX, { message: 'El correo electrónico no es válido' }),
      required(path.password, { message: 'La contraseña es obligatoria' }));
  });

  async onSubmit(event: Event) {
    event.preventDefault();
    this.isLoading.set(true);

    const { email, password } = this.loginModel();

    await delay(2000);

    this.authService
      .login(email, password)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (user) => {
          if (user) {
            TokenManager.prototype.setToken(user.id.toString());
            window.location.reload();
          } else {
            this.loginError.set('Credenciales inválidas. Por favor, inténtalo de nuevo.');
          }
        },
      });
  }
}
