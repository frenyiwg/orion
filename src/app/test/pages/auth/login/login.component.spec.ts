import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { LoginComponent } from '@pages/auth/login/login.component';
import { AuthService } from '@core/services';
import { TokenManager } from '@core/utils';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;

  const authServiceMock = {
    login: vi.fn(),
  };

  const routerMock = {
    navigate: vi.fn(),
  };

  let reloadSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    vi.spyOn(TokenManager.prototype, 'setToken').mockImplementation(() => {});

    reloadSpy = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { ...window.location, reload: reloadSpy },
      writable: true,
    });

    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  function getEmailInput(): HTMLInputElement {
    return fixture.nativeElement.querySelector(
      'input[placeholder="ejemplo@ejemplo.com"]',
    ) as HTMLInputElement;
  }

  function getPasswordInput(): HTMLInputElement {
    return fixture.nativeElement.querySelector(
      'input[placeholder="Introduzca su contraseña"]',
    ) as HTMLInputElement;
  }

  function getSubmitButton(): HTMLButtonElement {
    return fixture.nativeElement.querySelector(
      'button[aria-label="Iniciar sesión"]',
    ) as HTMLButtonElement;
  }

  it('should create and render the login UI', () => {
    expect(component).toBeTruthy();

    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1?.textContent).toContain('Iniciar sesión');

    expect(getEmailInput()).toBeTruthy();
    expect(getPasswordInput()).toBeTruthy();
    expect(getSubmitButton()).toBeTruthy();
  });

  it('should have submit button disabled initially (invalid form)', () => {
    const btn = getSubmitButton();
    expect(btn.disabled).toBe(true);
  });

  it('should show required errors when fields are touched and empty', () => {
    component.loginForm.email().markAsTouched();
    component.loginForm.password().markAsTouched();
    fixture.detectChanges();

    const errors = Array.from(
      fixture.nativeElement.querySelectorAll('p.text-red-400') as NodeListOf<HTMLParagraphElement>,
    ).map((p) => p.textContent?.trim());

    expect(errors.join(' ')).toContain('El correo electrónico es obligatorio');
    expect(errors.join(' ')).toContain('La contraseña es obligatoria');
  });

  it('should show invalid email error for wrong format', () => {
    component.loginModel.set({ email: 'not-an-email', password: '123456' });

    component.loginForm.email().markAsTouched();
    component.loginForm.password().markAsTouched();
    fixture.detectChanges();

    const emailError = Array.from(
      fixture.nativeElement.querySelectorAll('p.text-red-400') as NodeListOf<HTMLParagraphElement>,
    )
      .map((p) => p.textContent.trim() ?? '')
      .join(' ');

    expect(emailError).toContain('El correo electrónico no es válido');

    expect(getSubmitButton().disabled).toBe(true);
  });

  it('should enable submit button when form is valid and not loading', () => {
    component.loginModel.set({ email: 'test@test.com', password: '123456' });
    fixture.detectChanges();

    expect(component.loginForm().invalid()).toBe(false);
    expect(getSubmitButton().disabled).toBe(false);
  });

  it('should call authService.login with email and password on submit (after delay)', async () => {
    vi.useFakeTimers();

    authServiceMock.login.mockReturnValue(of({ id: 123 }));

    component.loginModel.set({ email: 'test@test.com', password: '123456' });
    fixture.detectChanges();

    const event = new Event('submit');
    const preventSpy = vi.spyOn(event, 'preventDefault');

    const promise = component.onSubmit(event);

    expect(component.isLoading()).toBe(true);
    expect(preventSpy).toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(2000);
    await promise;

    expect(authServiceMock.login).toHaveBeenCalledWith('test@test.com', '123456');
  });

  it('should show loader spinner while loading', async () => {
    vi.useFakeTimers();

    authServiceMock.login.mockReturnValue(of({ id: 1 }));

    component.loginModel.set({ email: 'test@test.com', password: '123456' });
    fixture.detectChanges();

    const promise = component.onSubmit(new Event('submit'));
    fixture.detectChanges();

    expect(component.isLoading()).toBe(true);
    const spinner = fixture.nativeElement.querySelector('.animate-spin');
    expect(spinner).toBeTruthy();

    await vi.advanceTimersByTimeAsync(2000);
    await promise;

    fixture.detectChanges();
    expect(component.isLoading()).toBe(false);
  });

  it('should set token and reload when login returns a user', async () => {
    vi.useFakeTimers();

    authServiceMock.login.mockReturnValue(of({ id: 999 }));

    component.loginModel.set({ email: 'ok@test.com', password: '123456' });
    fixture.detectChanges();

    const p = component.onSubmit(new Event('submit'));
    await vi.advanceTimersByTimeAsync(2000);
    await p;

    expect(TokenManager.prototype.setToken).toHaveBeenCalledWith('999');
    expect(window.location.reload).toHaveBeenCalled();
    expect(component.loginError()).toBeNull();
  });

  it('should show loginError when login returns null', async () => {
    vi.useFakeTimers();

    authServiceMock.login.mockReturnValue(of(null));

    component.loginModel.set({ email: 'bad@test.com', password: 'wrong' });
    fixture.detectChanges();

    const p = component.onSubmit(new Event('submit'));
    await vi.advanceTimersByTimeAsync(2000);
    await p;

    fixture.detectChanges();

    expect(component.loginError()).toContain('Credenciales inválidas');

    const errorEl = fixture.debugElement
      .queryAll(By.css('p.text-red-400'))
      .find((d) => (d.nativeElement?.textContent ?? '').includes('Credenciales inválidas'));
    expect(errorEl).toBeTruthy();

    expect(TokenManager.prototype.setToken).not.toHaveBeenCalled();
    expect(window.location.reload).not.toHaveBeenCalled();
  });
});
