import { Directive, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, EMPTY } from 'rxjs';
import { catchError, finalize, take, tap } from 'rxjs/operators';
import { DEFAULT_PAGINATION_LIMIT, INITIAL_PAGINATION_PAGE } from '../const';
import { IData } from '@core/interfaces';

@Directive()
export abstract class ListManager<T> implements OnInit {
  protected enableInitialLoad = false;
  protected defaultLimit: number = DEFAULT_PAGINATION_LIMIT;
  protected initialPage: number = INITIAL_PAGINATION_PAGE;

  params: Record<string, any> = {};
  data: T[] = [];

  isLoading = new BehaviorSubject<boolean>(true);

  ngOnInit() {
    if (this.enableInitialLoad) this.onFilter(this.params);
    else this.isLoading.next(false);
  }

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

  protected abstract search(params: Record<string, any>): Observable<IData<T>>;

  private getData() {
    this.data = [];

    this.isLoading.next(true);

    this.search(this.params)
      .pipe(
        take(1),
        tap((response) => {
          this.data = (response.data ?? []) as T[];
        }),
        catchError(() => {
          this.data = [];
          return EMPTY;
        }),
        finalize(() => this.isLoading.next(false)),
      )
      .subscribe();
  }
}
