import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from '@pages/auth/layout/layout.component';

@Component({
  standalone: true,
  selector: 'test-host',
  template: `<page-layout />`,
  imports: [LayoutComponent],
})
class HostComponent {}

describe('LayoutComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render a router-outlet', () => {
    const outlet = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(outlet).toBeTruthy();
  });

  it('should render the left panel with the logo image', () => {
    const el: HTMLElement = fixture.nativeElement;

    const leftPanel = el.querySelector('div.hidden.md\\:flex');
    expect(leftPanel).toBeTruthy();

    const img = el.querySelector('img[alt="Logo orion tek"]') as HTMLImageElement | null;
    expect(img).toBeTruthy();
    expect(img!.getAttribute('src')).toBe('assets/images/logos/oriontek-white.avif');

    expect(img!.className).toContain('max-w-xs');
  });

  it('should have the right panel containing the router outlet', () => {
    const el: HTMLElement = fixture.nativeElement;

    const rightPanel = el.querySelector('div.w-full.md\\:w-1\\/2.bg-neutral-foreground');
    expect(rightPanel).toBeTruthy();

    const outlet = rightPanel!.querySelector('router-outlet');
    expect(outlet).toBeTruthy();
  });

  it('should have responsive classes on the root container', () => {
    const el: HTMLElement = fixture.nativeElement;

    const root = el.querySelector('div.w-full.h-screen.flex') as HTMLDivElement | null;
    expect(root).toBeTruthy();

    expect(root!.className).toContain('md:flex-row');
    expect(root!.className).toContain('bg-neutral-foreground');
  });
});
