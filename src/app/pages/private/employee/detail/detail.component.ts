import { AsyncPipe, DecimalPipe, NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService, EmployeeService } from '@core/services';
import { finalize, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-employee-detail',
  templateUrl: 'detail.component.html',
  imports: [AsyncPipe, DecimalPipe, RouterLink, NgClass],
})
export class EmployeeDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(EmployeeService);
  private readonly authService = inject(AuthService);

  loading = signal(false);
  isAdmin = this.authService.user?.role === 'ADMIN';

  employee$ = this.route.paramMap.pipe(
    map((p) => p.get('id') ?? ''),
    switchMap((id) => {
      this.loading.set(true);
      return this.service.getEmployeeById(id).pipe(finalize(() => this.loading.set(false)));
    }),
    finalize(() => this.loading.set(false)),
  );
}
