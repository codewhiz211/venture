import { BehaviorSubject, Observable } from 'rxjs';

import { ClientSpec } from '../../interfaces/client-spec.interface';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ClientActiveService {
  private activeClient: BehaviorSubject<ClientSpec> = new BehaviorSubject(undefined);
  public readonly activeClient$: Observable<ClientSpec> = this.activeClient.asObservable();

  cleanActiveClient() {
    this.activeClient.next(null);
  }

  getActiveClient() {
    return this.activeClient.getValue();
  }

  setActiveClient(client) {
    this.activeClient.next(client);
  }
}
