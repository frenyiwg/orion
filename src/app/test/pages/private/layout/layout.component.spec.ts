import { Component, EventEmitter, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from '@pages/private/layout/layout.component';

// --- Stubs (standalone) ---
@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  template: '<nav data-testid="breadcrumbs">Breadcrumbs</nav>',
})
class BreadcrumbsStubComponent {}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  template: `
    <div data-testid="sidebar">
      <button type="button" data-testid="sidebar-navigate" (click)="navigate.emit()">
        Navigate
      </button>
    </div>
  `,
})
class SidebarStubComponent {
  @Output() navigate = new EventEmitter<void>();
}

// AuthService mock (solo porque el componente lo inyecta)
class AuthServiceMock {}

describe('LayoutComponent', () => {
  let fixture: ComponentFixture<LayoutComponent>;
  let component: LayoutComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutComponent],
      providers: [
        { provide: (await import('@core/services')).AuthService, useClass: AuthServiceMock },
      ],
    })

      .overrideComponent(LayoutComponent, {
        set: {
          imports: [BreadcrumbsStubComponent, SidebarStubComponent, RouterOutlet],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a router-outlet', () => {
    const outlet = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(outlet).toBeTruthy();
  });

  it('toggleSidebar should invert sidebarOpen', () => {
    expect(component.sidebarOpen()).toBeFalsy();

    component.toggleSidebar();
    expect(component.sidebarOpen()).toBeTruthy();

    component.toggleSidebar();
    expect(component.sidebarOpen()).toBeFalsy();
  });

  it('closeSidebar should set sidebarOpen to false', () => {
    component.sidebarOpen.set(true);
    expect(component.sidebarOpen()).toBeTruthy();

    component.closeSidebar();
    expect(component.sidebarOpen()).toBeFalsy();
  });

  it('toggleUserMenu should invert isUserMenuOpen', () => {
    expect(component.isUserMenuOpen()).toBeFalsy();

    component.toggleUserMenu();
    expect(component.isUserMenuOpen()).toBeTruthy();

    component.toggleUserMenu();
    expect(component.isUserMenuOpen()).toBeFalsy();
  });

  it('onEsc should close sidebar', () => {
    component.sidebarOpen.set(true);
    expect(component.sidebarOpen()).toBeTruthy();

    component.onEsc();
    expect(component.sidebarOpen()).toBeFalsy();
  });

  it('should close sidebar when Escape key is pressed (HostListener)', () => {
    component.sidebarOpen.set(true);
    fixture.detectChanges();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();

    expect(component.sidebarOpen()).toBeFalsy();
  });

  // ---------- Template behavior tests ----------
  it('overlay should be hidden when sidebarOpen is false', () => {
    const overlay = fixture.debugElement.query(By.css('button[aria-label="Cerrar menú"]'));
    expect(overlay).toBeTruthy();

    // cuando está cerrado, debe tener class hidden por [class.hidden]
    expect((overlay.nativeElement as HTMLButtonElement).classList.contains('hidden')).toBeTruthy();
  });

  it('overlay should be visible when sidebarOpen is true', () => {
    component.sidebarOpen.set(true);
    fixture.detectChanges();

    const overlay = fixture.debugElement.query(By.css('button[aria-label="Cerrar menú"]'));
    expect((overlay.nativeElement as HTMLButtonElement).classList.contains('hidden')).toBeFalsy();
  });

  it('clicking overlay should close sidebar', () => {
    component.sidebarOpen.set(true);
    fixture.detectChanges();

    const overlay = fixture.debugElement.query(By.css('button[aria-label="Cerrar menú"]'));
    overlay.nativeElement.click();
    fixture.detectChanges();

    expect(component.sidebarOpen()).toBeFalsy();
  });

  it('aside should have -translate-x-full when sidebar is closed', () => {
    component.sidebarOpen.set(false);
    fixture.detectChanges();

    const aside = fixture.debugElement.query(By.css('aside'));
    expect(aside.nativeElement.classList.contains('-translate-x-full')).toBeTruthy();
    expect(aside.nativeElement.classList.contains('translate-x-0')).toBeFalsy();
  });

  it('aside should have translate-x-0 when sidebar is open', () => {
    component.sidebarOpen.set(true);
    fixture.detectChanges();

    const aside = fixture.debugElement.query(By.css('aside'));
    expect(aside.nativeElement.classList.contains('translate-x-0')).toBeTruthy();
    expect(aside.nativeElement.classList.contains('-translate-x-full')).toBeFalsy();
  });

  it('clicking hamburger button should toggle sidebar', () => {
    const hamburger = fixture.debugElement.query(By.css('button[aria-label="Abrir menú"]'));
    expect(hamburger).toBeTruthy();

    expect(component.sidebarOpen()).toBeFalsy();
    hamburger.nativeElement.click();
    fixture.detectChanges();
    expect(component.sidebarOpen()).toBeTruthy();

    hamburger.nativeElement.click();
    fixture.detectChanges();
    expect(component.sidebarOpen()).toBeFalsy();
  });

  it('should close sidebar when app-sidebar emits navigate', () => {
    component.sidebarOpen.set(true);
    fixture.detectChanges();

    const navigateBtn = fixture.debugElement.query(By.css('[data-testid="sidebar-navigate"]'));
    navigateBtn.nativeElement.click();
    fixture.detectChanges();

    expect(component.sidebarOpen()).toBeFalsy();
  });
});
