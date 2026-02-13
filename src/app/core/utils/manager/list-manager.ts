import { Directive, inject, OnInit, signal } from '@angular/core';
import { BehaviorSubject, Observable, EMPTY } from 'rxjs';
import { catchError, finalize, take, tap } from 'rxjs/operators';
import { DEFAULT_PAGINATION_LIMIT, INITIAL_PAGINATION_PAGE } from '../const';
import { IData } from '@core/interfaces';
import { AuthService } from '@core/services';

@Directive()
export abstract class ListManager<T> implements OnInit {
  private readonly authUser = inject(AuthService);

  protected enableInitialLoad = false;
  protected defaultLimit: number = DEFAULT_PAGINATION_LIMIT;
  protected initialPage: number = INITIAL_PAGINATION_PAGE;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: Record<string, any> = {};
  data = signal<T[]>([]);
  total = 0;

  isLoading = new BehaviorSubject<boolean>(true);

  ngOnInit() {
    if (this.enableInitialLoad) this.onFilter(this.params);
    else this.isLoading.next(false);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFilter(value: Record<string, any>) {
    this.params = {
      numeroPagina: this.initialPage,
      limite: this.defaultLimit,
      ...value,
    };

    this.getData();
  }

  onPaginate(page: number, limit?: number) {
    this.params['numeroPagina'] = page;
    if (limit) this.params['limite'] = limit;

    this.getData();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected abstract search(params: Record<string, any>): Observable<IData<T[]>>;

  private getData() {
    this.data.set([]);

    this.isLoading.next(true);

    this.search(this.params)
      .pipe(
        take(1),
        tap((response) => {
          this.data.set((response.data ?? []) as T[]);
          this.total = this.data().length ?? 0;
        }),
        catchError(() => {
          this.data.set([]);
          return EMPTY;
        }),
        finalize(() => this.isLoading.next(false)),
      )
      .subscribe();
  }

  get isAdmin(): boolean {
    return this.authUser.user?.role === 'ADMIN';
  }
}
