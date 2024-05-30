import { Component, OnInit } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

import { AdminService } from '../admin.service';
import { ClientService } from '@clients/services/client.service';
import { ClientSummary } from '@interfaces/client-summary.interface';
import { Column } from '@shared/components/ven-table/columns.interface';
import { ConfirmationDialogComponent } from '@shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { DialogService } from '@shell/dialogs/dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'ven-build-management-tab',
  templateUrl: './build-management-tab.component.html',
  styleUrls: ['./build-management-tab.component.scss'],
})
export class BuildManagementTabComponent implements OnInit {
  public clients$: Observable<ClientSummary[]> = new ReplaySubject(1);
  public columns: Column[];
  public loading = undefined;

  constructor(
    private clientService: ClientService,
    private dialogService: DialogService,
    private adminService: AdminService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.clients$ = this.clientService.clients$;
    this.clientService.getClients(true);
    this.columns = [
      { accessor: 'lot', label: 'Lot#', width: '30%', mobileWidth: '30%' },
      { accessor: 'client', label: 'Client Name', width: '30%', mobileWidth: '60%' },
      { accessor: 'lastModified', label: 'Last Modified', width: '30%', format: 'shortDate', mobileWidth: '0%' },
      { accessor: 'delete', label: '', type: 'operator', icon: 'delete', width: '10%', mobileWidth: '10%' },
    ];
  }

  handleClientDeleteClicked(row) {
    // tslint:disable-next-line
    const message = `Deleting will permanently remove the record for <i>${row.client}</i><br />This action can not be undone.`;
    this.dialogService
      .open(ConfirmationDialogComponent, {
        data: {
          html: message,
        },
        dialogTitle: 'Delete Build',
      })
      .subscribe((result) => {
        if (result) {
          this.loading = 'Deleting Client';
          this.adminService.deleteClient(row.uid).subscribe(
            () => {
              this.clientService.getClients(true);
              this.snackBar.open('Client deleted');
              this.loading = undefined;
            },
            (err) => {
              this.snackBar.open('Client deletion FAILED');
              this.loading = undefined;
              console.error(err.message);
            }
          );
        }
      });
  }
  d;
}
