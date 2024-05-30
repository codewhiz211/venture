import { BehaviorSubject, Observable } from 'rxjs';

import { ClientSummary } from '@interfaces/client-summary.interface';
import { FilterDefinition } from '../filter-definition.interface';
import { Injectable } from '@angular/core';

/**
 * Retrives possible filter options from the database
 */
@Injectable()
export class FilterService {
  private filterOptions: BehaviorSubject<any> = new BehaviorSubject(undefined);
  public readonly filterOptions$: Observable<any> = this.filterOptions.asObservable();

  private activeFilter: FilterDefinition;

  public getSearchTermsFromClients(clients: ClientSummary[]) {
    const searchTerms = {
      subdivisions: [],
      consultants: [],
      pms: [],
      statuses: [],
    };
    clients.forEach((client) => {
      if (client.subdivision) {
        const subdivision = client.subdivision.toLowerCase();
        if (!searchTerms.subdivisions.find((sub) => sub === subdivision)) {
          searchTerms.subdivisions.push(subdivision);
        }
      }
      if (client.consultantName) {
        const consultant = client.consultantName.toLowerCase();
        if (!searchTerms.consultants.find((con) => con === consultant)) {
          searchTerms.consultants.push(consultant);
        }
      }
      if (client.projectManagerName) {
        const projectManager = client.projectManagerName.toLowerCase();
        if (!searchTerms.pms.find((pm) => pm === projectManager)) {
          searchTerms.pms.push(projectManager);
        }
      }
      if (client.status) {
        const clientStatus = client.status.toLowerCase();
        if (!searchTerms.statuses.find((status) => status === clientStatus)) {
          searchTerms.statuses.push(clientStatus);
        }
      }
    });
    searchTerms.subdivisions.sort();
    searchTerms.consultants.sort();
    searchTerms.pms.sort();
    searchTerms.statuses.sort();

    return searchTerms;
  }

  public getActiveFilter() {
    return this.activeFilter;
  }

  public storeActiveFilter(filterDefinition: FilterDefinition) {
    this.activeFilter = filterDefinition;
  }

  public filterOutUnSelected(options: any) {
    const filtered = [];
    Object.keys(options).forEach((key) => {
      if (key === 'any') {
        // strip out the any flag
      } else if (options[key]) {
        // pass other keys only if true
        filtered.push(key);
      }
    });
    return filtered;
  }
}
