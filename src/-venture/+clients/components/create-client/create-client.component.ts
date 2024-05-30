import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { EVENT_TYPES, IDrawerContentComponent } from '@shell/drawer/drawer-content.interfaces';
import { Observable, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

import { ClientService } from '../../services/client.service';
import { DialogService } from '@shell/dialogs/dialog.service';
import { DrawerService } from '@shell/drawer/drawer.service';
import { ExportService } from '@shared/export/export.service';
import { SpecService } from '@services/spec/spec.service';

@Component({
  selector: 'ven-create-client',
  templateUrl: './create-client.component.html',
  styleUrls: ['./create-client.component.scss'],
})
export class CreateClientComponent implements OnInit, OnDestroy, IDrawerContentComponent {
  @Input() data: any;
  @Output() itemAdded = new EventEmitter();

  public clientForm: FormGroup;
  public loading = false;
  public errorMessage = '';
  public clients: Observable<any>;
  public specUid: string;

  private destroy$ = new Subject();

  public submitAction = {
    label: 'SAVE',
    handler: () => (this.clientForm.get('specUid') ? this.onSaveWithExistingSpec() : this.onSaveClick()),
  };

  public closeAction = {
    label: 'CANCEL',
    handler: () => this.onCancelClick(),
  };

  constructor(
    private drawerService: DrawerService,
    private dialogService: DialogService,
    private clientService: ClientService,
    private formBuilder: FormBuilder,
    private specService: SpecService,
    private exportService: ExportService
  ) {
    this.clientForm = this.formBuilder.group({
      client: ['', Validators.compose([Validators.required])],
      subdivision: ['', Validators.compose([Validators.required, this.dotValidator()])],
      lot: ['', Validators.compose([Validators.required])],
      duplicateSpec: [false],
      syncFreedom: [false],
    });
  }

  ngOnInit() {
    this.getActiveClients();
    this.handleDuplicateSpec();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  dotValidator() {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== null && control.value.match(/[.]/g)) {
        return { invalidValue: true };
      }
      return null;
    };
  }

  onSaveClick(copyOfSpec?) {
    this.loading = true;
    this.errorMessage = '';
    const lot = this.clientForm.value.lot;
    const client = this.clientForm.value.client;
    const subdivision = this.clientForm.value.subdivision;
    const clientData: any = {
      client,
      subdivision,
      lot,
      synced: this.clientForm.value.syncFreedom,
      lastModified: Date.now(),
      dateModified: Date.now(), // Freedom Needs this
      status: copyOfSpec?.details?.status || 'Quote',
    };

    if (copyOfSpec) {
      copyOfSpec.details = {
        client,
        lastModified: Date.now(),
        status: copyOfSpec?.details?.status,
      };
      copyOfSpec.section_details = {
        subdivision,
        lot,
      };
    }

    this.clientService
      .addClient(clientData, copyOfSpec)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (client) => {
          setTimeout(() => this.syncWithFreedom(client, lot), 1000);
          this.loading = false;
          this.drawerService.raiseEvent(EVENT_TYPES.clientAdded, client);
          this.drawerService.close();
          this.dialogService.closeActiveDialog(client);
        },
        (error) => {
          this.loading = false;
          this.errorMessage = error.message ? error.message : error.toString();
        }
      );
  }

  onCancelClick() {
    this.drawerService.close();
    this.dialogService.closeActiveDialog();
  }

  setUid(value) {
    this.clientForm.get('specUid').patchValue(value);
  }

  onSaveWithExistingSpec() {
    this.clientService
      .getCopySpec(this.clientForm.get('specUid').value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((spec) => {
        this.onSaveClick(spec);
      });
  }

  private getActiveClients() {
    this.clients = this.clientService.getClients();
  }

  private handleDuplicateSpec() {
    this.clientForm
      .get('duplicateSpec')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: boolean) => {
        if (value) {
          this.clientForm.addControl('specUid', new FormControl('', Validators.required));
        } else {
          this.clientForm.removeControl('specUid');
        }
      });
  }

  private syncWithFreedom(newClient, lot) {
    if (!this.clientForm.get('syncFreedom').value) {
      return;
    }
    this.clientService
      .getClientInfo(newClient.uid)
      .pipe(
        switchMap(() => [this.specService.getClientSpecAndSuggestions(newClient.uid)]),
        switchMap(() => {
          const clientSpec = this.specService.getActiveSpec();
          return this.exportService.exportSpec(clientSpec, lot);
        })
      )
      .subscribe();
  }
}
