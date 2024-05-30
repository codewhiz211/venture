import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { flatMap, map, tap } from 'rxjs/operators';

import { AuditService } from '@services/spec/audit.service';
import { BaseDbService } from '@services/base.db.service';
import { ChecklistService } from '@services/checklist.service';
import { ClientSpec } from '@interfaces/client-spec.interface';
import { ClientSummary } from '@interfaces/client-summary.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { defaultSectionOrder } from '@shared/config/spec-config/defaultSectionOrder';
import { sectionConfig } from '@shared/config/spec-config';

@Injectable({
  providedIn: 'root',
})
export class ClientService extends BaseDbService {
  private activeClient: BehaviorSubject<ClientSpec> = new BehaviorSubject(undefined);
  public readonly activeClient$: Observable<ClientSpec> = this.activeClient.asObservable();

  private clients: BehaviorSubject<ClientSummary[]> = new BehaviorSubject(undefined);
  public clients$: Observable<ClientSummary[]> = this.clients.asObservable();
  private clientsRequest$: Observable<ClientSummary[]>;

  constructor(private http: HttpClient, private auditService: AuditService, private checklistService: ChecklistService) {
    super();
  }

  getActiveClient() {
    return this.activeClient.getValue();
  }

  cleanActiveClient() {
    this.activeClient.next(null);
  }

  getClientInfo(uid) {
    return this.http.get(`/clients/${uid}`);
  }

  addClient(clientData, existingSpec?) {
    // when we add a client we:
    // 1) add an entry to the clients table and get a UID in return - this will be used to display list of clients
    // 2) add an entry to the spec table - there will be one spec per client. The key is the client UID.
    // 3) add an entry to the search table
    // NOTE: newClient.name is the UID of the inserted object

    return this.http.post(`/clients`, clientData).pipe(
      flatMap((newClient: any) => {
        // todo combine (chain)
        const spec = existingSpec || this.getDefaultSpec(clientData);
        // add the client subdivision to list of search terms
        const searchTerm = {};
        searchTerm[clientData.subdivision] = true;
        const requests = [
          this.http.patch(`/spec/${newClient.name}`, spec),
          this.http.patch('/search/subdivisions', searchTerm),
          this.checklistService.createChecklists(newClient.name),
        ];
        return forkJoin(requests).pipe(
          map((updatedClient: any) => {
            return {
              uid: newClient.name,
              ...updatedClient,
            };
          }),
          tap((client) => {
            this.auditService.createInitialAudit(clientData, newClient.name).subscribe();
            this.activeClient.next(client);
          })
        );
      })
    );
  }

  public deleteClient(client: any) {
    const requests = [
      this.http.delete(`/clients/${client.uid}`),
      this.http.delete(`/spec/${client.uid}`),
      this.http.delete(`/snapshots/${client.uid}`),
      this.http.delete(`/files/${client.uid}`),
    ];
    return forkJoin(requests);
  }

  getClients(refresh: boolean = false) {
    if (refresh || !this.clientsRequest$) {
      this.clientsRequest$ = this.getClientsFromServer();

      this.clientsRequest$.subscribe(
        (result) => {
          this.clients.next(result);
        },
        (err) => this.clients.error(err)
      );
    }
    return this.clients.asObservable();
  }

  getClientsFromServer(): Observable<ClientSummary[]> {
    return this.http.get<ClientSummary[]>(`/clients`).pipe(map((data) => this.addKeys(data)));
  }

  getCopySpec(uid) {
    return this.http.get(`/spec/${uid}`);
  }

  private getDefaultSpec(clientData) {
    // starting point for spec in the DB
    const spec = {};

    // initialise details with data from client
    spec['details'] = {
      status: 'Quote',
      synced: clientData.synced,
      specVersion: 4.01, //2.01 version is for new tile sections.3.01 version is for new Electrical Package. 4.01 version is for turnkey fee raised to 3% from 1.5%
    };

    // ensure that new specs starts with all properties defined
    sectionConfig.forEach((section) => {
      const sect: any = section; // get rid of stupid compiler warning
      if (sect.fields) {
        spec[section.name] = {
          dummy: ' ',
        };
      }
      if (sect.hasExtras) {
        spec['extras'] = { [section.name]: ' ' };
      }
      // if (sect.hasCustom) {
      //   // start with one custom block (user can remove all)
      //   spec[sect.custom.name] = sect.custom.default ? { '0': sect.custom.default } : { '0': { 'dummy': ' ' } };
      // }
    });

    // manually add custom sections as they are now interspersed
    spec['blinds-additional'] = { '0': { blinds: ' ' } };
    spec['cladding-additional'] = { '0': { claddingType: 'Brick' } };
    spec['flooring-additional'] = { '0': { floorTypes: 'Carpet' } };
    spec['tiles-bathroom-additional'] = { '0': { tileType: '' } };
    spec['tiles-ensuite-additional'] = { '0': { tileType: '' } };
    spec['tiles-toilet-additional'] = { '0': { tileType: '' } };
    spec['tiles-kitchen-additional'] = { '0': { tileType: '' } };

    spec['hiddenSections'] = { [sectionConfig[0].name]: false };

    spec['quote'] = { buildPrice: 0, initialCommitment: 0, landPrice: 0, paymentMethod: 'Turnkey Payment method' };
    spec['electrical'] = { dummy: ' ' };
    spec['planning'] = {
      planning: `
    * Full set of working drawings
    * Engineer designed foundation to meet NZS3604 regulations
    * Contract works Insurance - Total cost of the contract
    * Public Liability Insurance $1,000,000
    * 10 Year Standard Master Builders Guarantee
    * Council Permit Included
    * Professionally cleaned on completion`,
    };
    spec['sort'] = { orderList: defaultSectionOrder };
    // initialise extras properties
    spec['extras'] = { [sectionConfig[0].name]: ' ' };
    spec['extras_optional'] = { [sectionConfig[0].name]: ' ' };
    spec['extras_manual'] = { [sectionConfig[0].name]: ' ' };
    // lot is displayed in header (details) but is edited in section_details
    spec['section_details'] = {
      subdivision: clientData.subdivision,
      lot: clientData.lot,
    };
    spec['contact_details'] = {
      client: clientData.client,
    };
    return spec;
  }
}
