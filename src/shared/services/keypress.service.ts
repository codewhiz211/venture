import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KeypressService {
  constructor() {}

  public printSelected$: Subject<boolean> = new Subject();

  registerKeyPress(event: KeyboardEvent) {
    if (event.ctrlKey && event.keyCode) {
      if (event.keyCode === 80) {
        event.stopImmediatePropagation();
        event.preventDefault();
        this.printSelected$.next(true);
      }
    }
  }
}
