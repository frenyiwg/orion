import { Component, computed, inject, signal } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';

interface Crumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumbs',
  imports: [RouterLink],
  templateUrl: './breadcrumbs.component.html',
})
export class BreadcrumbsComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private tick = signal(0);

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        this.tick.update((v) => v + 1);
      });
  }

  breadcrumbs = computed<Crumb[]>(() => {
    this.tick();

    const crumbs: Crumb[] = [];
    let current = this.route.root;
    let url = '';

    while (current.firstChild) {
      current = current.firstChild;

      const snapshot = current.snapshot;
      const segment = snapshot.url.map((s) => s.path).join('/');
      if (segment) url += `/${segment}`;

      const label = snapshot.data?.['breadcrumb'] as string | undefined;
      if (label) crumbs.push({ label, url });
    }

    return crumbs;
  });
}
