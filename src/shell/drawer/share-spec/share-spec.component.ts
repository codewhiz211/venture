import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';

import { AuthService } from '@auth/services/auth.service';
import { AuthUser } from '@auth/types';
import { DialogService } from '@shell/dialogs/dialog.service';
import { DrawerService } from '../drawer.service';
import { FileService } from 'src/+files/src/services/file.service';
import { MatAccordion } from '@angular/material/expansion';
import { MatDialog } from '@angular/material/dialog';
import { ShareService } from '@services/spec/share.service';
import ShareType from '@interfaces/share-type.enum';
import { SnapshotService } from '@services/spec/snapshot.service';
import { Subject } from 'rxjs';
import { WindowService } from '@services/window.service';

@Component({
  selector: 'ven-share-spec',
  templateUrl: './share-spec.component.html',
  styleUrls: ['./share-spec.component.scss'],
})
export class ShareSpecComponent implements OnInit, OnDestroy {
  @Input() data: any;
  @ViewChild('historicCopies') historicCopies: MatAccordion;

  // TODO there's a lot of depdencies here - split?
  constructor(
    private cdRef: ChangeDetectorRef,
    public dialog: MatDialog,
    private authService: AuthService,
    private windowService: WindowService,
    private drawerService: DrawerService,
    private dialogService: DialogService,
    private snapshotService: SnapshotService,
    private shareService: ShareService,
    private fileService: FileService
  ) {}

  public selectedCopy: string;
  public isMobile = false;
  public loading: boolean = true;
  public printing: boolean = false;
  public showEmailForm: boolean = false;
  public emailData;

  public ShareType = ShareType;
  public printItem = ShareType.NotSelected;
  public includeSpec = false;

  public error;

  public spec;
  public snapId = 0; // create a copy (snapshot) of current spec
  public specSnapshots = [];
  public showCopy = this.snapId === 0;
  public attachments: any[] = [];
  public isSafariFirefox: boolean;

  private checklists: any[] = [];
  private _destroy$ = new Subject<any>();
  private updateSnapshot = false;
  private _valueChange$ = new Subject<any>();

  public files$;

  public closeAction = {
    label: 'CANCEL',
    handler: () => this.onCancelClick(),
  };

  public shareUrl: string = '';

  description = new FormControl('', [Validators.required]);

  ngOnDestroy() {
    this.cdRef.detach();
    this._destroy$.next();
    this._destroy$.complete();
  }

  ngOnInit(): void {
    this.isMobile = this.windowService.isMobile;
    this.spec = this.data.spec;
    this.files$ = this.fileService.getAllFiles(this.data.uid);
    this.snapshotService.getSnapshots(this.data.uid).subscribe((snaps) => {
      this.specSnapshots = snaps.sort((a, b) => this.sortByDate(a, b));
      this.loading = false;
      if (!this.cdRef['destroyed']) {
        this.cdRef.detectChanges();
      }
    });

    this.description.valueChanges.pipe(takeUntil(this._destroy$), debounceTime(500)).subscribe(() => {
      this.validate();
    });
  }

  getErrorMessage() {
    return this.description.hasError('required') ? 'You must enter a value' : '';
  }

  validate() {
    this.error = undefined;
    if (
      (this.printItem === ShareType.Spec || this.printItem === ShareType.Extras || this.printItem === ShareType.Quote) &&
      this.snapId === 0 &&
      !this.description.value
    ) {
      if (this.printItem === ShareType.Spec || this.includeSpec) {
        this.error = { id: 2, msg: 'You need to enter a snapshot description' };
      }
    } else if (this.printItem === ShareType.Checklists && this.checklists.length === 0) {
      this.error = { id: 3, msg: 'You chose checklists, but did not choose any' };
    }
    return this.error === undefined;
  }

  onSelectedFilesChanged(files) {
    this.attachments = files;
  }

  onSelectedChecklistsChanged(checklists) {
    this.checklists = checklists;
  }

  onCancelClick() {
    if (this.isSafariFirefox && this.snapId !== 0) {
      this.snapshotService
        .deleteSnapshot(this.data.uid, this.snapId)
        .pipe(takeUntil(this._destroy$))
        .subscribe(() => {
          this.drawerService.close();
          this.dialogService.closeActiveDialog();
        });
    } else {
      this.drawerService.close();
      this.dialogService.closeActiveDialog();
    }
  }

  onPrintPreview() {
    if (!this.validate()) {
      return;
    }

    let shareLink;
    // when snapId is 0 then we need to create a snapshot of the current spec and share that
    if (this.printItem !== ShareType.Checklists) {
      if (this.includeSpec) {
        if (this.printItem === ShareType.Extras) {
          this.printItem = ShareType.ExtrasAndSpec;
        } else if (this.printItem === ShareType.Quote) {
          this.printItem = ShareType.QuoteAndSpec;
        }
      }

      // create snapshot and assign response to snapId
      if (!this.snapId) {
        this.createSnapshot(this.description.value, this.includeSpec).subscribe((response: any) => {
          if (!this.updateSnapshot) {
            this.snapId = response.name;
          }
          shareLink = this.shareService.getShareUrl(this.data.uid, this.snapId, this.printItem, []);
          this.openNewWindowAndCloseDrawer(shareLink);
        });
      } else {
        shareLink = this.shareService.getShareUrl(this.data.uid, this.snapId, this.printItem, []);
        this.openNewWindowAndCloseDrawer(shareLink);
      }
    } else {
      // otherwise we share a checklist(s) or the selected snapshot
      shareLink = this.shareService.getShareUrl(
        this.data.uid,
        this.printItem === ShareType.Checklists ? -1 : this.snapId,
        this.printItem,
        this.printItem === ShareType.Checklists ? this.checklists : []
      );

      this.openNewWindowAndCloseDrawer(shareLink);
    }
  }

  private openNewWindowAndCloseDrawer(shareLink) {
    this.drawerService.close();
    this.dialogService.closeActiveDialog();
    this.windowService.windowRef.open(shareLink, '_blank');
  }

  onEmailLink() {
    if (!this.validate()) {
      return;
    }
    this.emailData = {
      email: '',
      message: '',
      subject: '',
    };
    this.showEmailForm = true;
  }

  onFormSubmitted(formValues) {
    this.showEmailForm = false;
    const fromAddress = (this.authService.authUser as AuthUser).email;

    if (this.snapId === 0 && this.printItem !== this.ShareType.Checklists && this.printItem !== this.ShareType.Files) {
      // create snapshot and assign to snapId
      this.createSnapshot(this.description.value, this.includeSpec).subscribe((response: any) => {
        this.snapId = response.name;
        this.drawerService.close();
        this.dialogService.closeActiveDialog();
        this.sendEmail(fromAddress, formValues);
      });
    } else {
      this.drawerService.close();
      this.dialogService.closeActiveDialog();
      this.sendEmail(fromAddress, formValues);
    }
  }

  public onCopyChosen(chosenCopyDesc) {
    this.selectedCopy = chosenCopyDesc;
    this.showCopy = false;
    this.updateSnapshot = false;
    // close the panel once copy chosen, to avoid buttons being off screen
    this.historicCopies.closeAll();
  }

  public showSpecCopy() {
    this.snapId = 0;
    this.showCopy = true;
    this.validate();
  }

  public updateLink() {
    this._valueChange$.next();
  }

  public onCopied() {
    // TODO BUG SC5070 we should create a snapshot here to update snapId, but this needs to happen BEFORE the copy link is generated
    this.dialogService.closeActiveDialog();
  }

  private sortByDate(a, b) {
    const c = new Date(a.created);
    const d = new Date(b.created);
    return c > d ? -1 : c < d ? 1 : 0;
  }

  private sendEmail(fromAddress, formValues) {
    if (this.printItem === ShareType.Files) {
      this.shareService.sendShareFiles(fromAddress, formValues, this.data.spec.uid, this.attachments);
    } else {
      const shareLink = this.shareService.getShareUrl(this.data.uid, this.snapId, this.printItem, this.checklists);
      this.shareService.sendShareEmail(fromAddress, formValues, this.data.spec.uid, shareLink);
    }
  }

  private createSnapshot(description, includedSpec: boolean) {
    const { suggestions, ...specWithoutSuggestions } = this.data.spec;
    //clear signature for new snapshot
    delete specWithoutSuggestions.signatures;
    const snapshotData: any = {
      spec: specWithoutSuggestions,
      description,
      includedSpec,
      created: Date.now(),
      createdBy: (this.authService.authUser as AuthUser).email,
    };
    if (this.updateSnapshot) {
      return this.snapshotService.updateSnapshot(this.data.uid, this.snapId, snapshotData);
    } else {
      return this.snapshotService.saveSnapshot(this.data.uid, snapshotData);
    }
  }
}
