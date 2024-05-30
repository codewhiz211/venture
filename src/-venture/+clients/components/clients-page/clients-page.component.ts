import { Component, OnInit } from '@angular/core';

import { ClientService } from '../../services/client.service';
import { ClientSummary } from '@interfaces/client-summary.interface';
import { CreateClientComponent } from '../create-client/create-client.component';
import { DrawerContent } from '@shell/drawer/drawer-content.type';
import { DrawerService } from '@shell/drawer/drawer.service';
import { EVENT_TYPES } from '@shell/drawer/drawer-content.interfaces';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { SpecService } from '@services/spec/spec.service';

@Component({
  selector: 'ven-clients-page',
  templateUrl: './clients-page.component.html',
  styleUrls: ['./clients-page.component.scss'],
})
export class ClientsPageComponent implements OnInit {
  public clients$: Observable<ClientSummary[]>;

  constructor(
    private specService: SpecService,
    private clientService: ClientService,
    private drawerService: DrawerService,
    private router: Router
  ) {}

  ngOnInit() {
    this.clients$ = this.clientService.clients$;
    this.specService.clearActiveSpec();
    this.clientService.getClients(true);
    this.drawerService.events$.subscribe((event) => {
      if (event.type === EVENT_TYPES.clientAdded) {
        this.router.navigate(['/venture/spec', event.data.uid]);
      }
    });
  }

  onAddNewClient() {
    this.drawerService.open(new DrawerContent(CreateClientComponent, {}));
  }

  handleClientClicked(row) {
    this.router.navigate(['/venture/spec', row.uid]);
  }
}
