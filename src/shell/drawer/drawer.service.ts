import { EVENT_TYPE, IDrawerContentComponent, IDrawerEvent } from './drawer-content.interfaces';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { SpecActiveService } from '@services/spec/spec.active.service';

/* NOTE


THIS SHOULD NOT BE USED IN NEW CODE
IT IS KEPT HERE UNTIL WE MOVE ALL CODE (STAFF APP) TO NEW SHELL


USE dialog.service instead




DON'T USE THIS SERVICe ANYMORE

*/

@Injectable({
  providedIn: 'root',
})
export class DrawerService {
  private events: Subject<IDrawerEvent> = new Subject();
  public readonly events$: Observable<IDrawerEvent> = this.events.asObservable();

  private drawerState: EventEmitter<any> = new EventEmitter();
  public readonly drawerState$: Observable<IDrawerEvent> = this.drawerState.asObservable();

  constructor(private specActiveService: SpecActiveService) {}

  public close() {
    this.specActiveService.closeSectionAction();
    this.drawerState.emit(undefined);
  }
  public open(component: IDrawerContentComponent) {
    this.drawerState.emit(component);
  }

  public raiseEvent(type: EVENT_TYPE, data?: any) {
    this.events.next({ type, data });
  }
}
