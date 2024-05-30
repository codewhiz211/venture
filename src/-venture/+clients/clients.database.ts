import { BehaviorSubject } from 'rxjs';
import { ClientSummary } from '@interfaces/client-summary.interface';

export class ClientsDatabase {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<ClientSummary[]> = new BehaviorSubject<ClientSummary[]>([]);
  get data(): ClientSummary[] {
    return this.dataChange.value;
  }

  constructor(clients) {
    this.dataChange = new BehaviorSubject<ClientSummary[]>(clients);
  }
}
