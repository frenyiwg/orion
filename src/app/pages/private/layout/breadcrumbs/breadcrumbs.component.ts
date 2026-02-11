import { Component, computed, inject } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';

type Crumb = { label: string; url: string };

@Component({
  selector: 'app-breadcrumbs',
  imports: [RouterLink],
  templateUrl: './breadcrumbs.component.html',
})
export class BreadcrumbsComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private _tick = 0;

  breadcrumbs = computed<Crumb[]>(() => {
    // lee tick para recomputar
    void this._tick;

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
