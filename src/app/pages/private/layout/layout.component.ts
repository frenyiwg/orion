import { Component, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '@core/services';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'page-layout',
  templateUrl: './layout.component.html',
  imports: [RouterOutlet, BreadcrumbsComponent, SidebarComponent],
})
export class LayoutComponent {}
