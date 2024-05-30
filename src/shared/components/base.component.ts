import { Directive, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[venBaseComponent]',
}) // Needed only for Angular v9+ strict mode that enforce decorator to enable Component inheritance
export class BaseComponent implements OnDestroy {
  constructor() {}
  // _destroy$ is LAZY: it'll be created (and allocate memory) only if you use takeUntilDestroy
  private _destroy$?: Subject<void>;
  protected takeUntilDestroy = <T>() => {
    if (!this._destroy$) this._destroy$ = new Subject<void>(); // LAZY Subject
    return takeUntil<T>(this._destroy$);
  };
  ngOnDestroy() {
    if (this._destroy$) {
      this._destroy$.next();
      this._destroy$.complete();
    }
  }
}
