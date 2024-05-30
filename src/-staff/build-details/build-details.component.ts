import { Component, OnInit } from '@angular/core';
import { DialogService, DialogSize } from '@shell/dialogs/dialog.service';
import { first, switchMap } from 'rxjs/operators';

import { ActivatedRoute } from '@angular/router';
import { AppChromeDetailsPageFooterConfig } from '@shell/app-chrome-details-page-footer/app-chrome-details-page-footer.component';
import { BaseComponent } from '@shared/components/base.component';
import COLOURS from '@styles/colours';
import { ClientModel } from '@interfaces/client-model';
import { ClientService } from '@clients/services/client.service';
import { EditQuoteComponent } from '@shell/drawer/edit-quote/edit-quote.component';
import { ExportService } from '@shared/export/export.service';
import { ExtraTabContentComponent } from './extra-tab-content/extra-tab-content.component';
import { FilesTabContentComponent } from '../../+files/src/components/files-tab-content/files-tab-content.component';
import { FolderService } from 'src/+files/src/services/folder.service';
import { PreferenceService } from '@services/preference.service';
import { QuoteTabContentComponent } from './quote-tab-content/quote-tab-content.component';
import { RestoreSnapshotComponent } from '@shell/drawer/restore-snapshot/restore-snapshot.component';
import { ShareSpecComponent } from '@shell/drawer/share-spec/share-spec.component';
import { SnackBarService } from '@services/snackbar.service';
import { SpecActiveService } from '@services/spec/spec.active.service';
import { SpecAddNewSectionComponent } from '@shell/drawer/spec-add-new-section/spec-add-new-section.component';
import { SpecAuditComponent } from '@shell/drawer/spec-audit/spec-audit.component';
import { SpecReOrderComponent } from '@shell/drawer/spec-re-order/spec-re-order.component';
import { SpecService } from '@services/spec/spec.service';
import { SpecTabContentComponent } from '../../spec-controls/components/spec-tab-content/spec-tab-content.component';
import { SpecTrackChangesComponent } from '@shell/drawer/spec-track-changes/spec-track-changes.component';
import { SubbieJobBoardComponent } from '@jobs/components/subbie-job-board/subbie-job-board.component';
import { SubbieJobDetailComponent } from '@jobs/components/subbie-job-detail/subbie-job-detail.component';
import { TakeSnapshotComponent } from '@shell/drawer/take-snapshot/take-snapshot.component';
import { TrackingService } from '@services/spec/tracking.service';
import { WindowService } from '@services/window.service';
import { combineLatest } from 'rxjs';
import { sectionConfig } from '@shared/config/spec-config';

@Component({
  selector: 'app-build-details',
  templateUrl: './build-details.component.html',
  styleUrls: ['./build-details.component.scss'],
})
export class BuildDetailsComponent extends BaseComponent implements OnInit {
  public headerConfig;
  public footerConfig: AppChromeDetailsPageFooterConfig;
  public contentConfig;
  public currentTab: string = 'spec';
  private isDesktop = true;

  constructor(
    private route: ActivatedRoute,
    private clientService: ClientService,
    private exportService: ExportService,
    private specService: SpecService,
    private specActiveService: SpecActiveService,
    private windowService: WindowService,
    private preference: PreferenceService,
    private dialogService: DialogService,
    private trackingService: TrackingService,
    private folderService: FolderService,
    private snackBarService: SnackBarService
  ) {
    super();
  }

  private spec = null;
  private sections = null;

  ngOnInit(): void {
    const specUid = this.route.snapshot.paramMap.get('specUid');

    combineLatest([this.specActiveService.activeSpec$, this.folderService.currentFolder])
      .pipe(this.takeUntilDestroy())
      .subscribe(([spec, folder]) => {
        //to avoid old value subscribed to new loading page
        if (!spec || spec.uid != specUid) {
          return;
        }
        // not sure why, but if these are updated after the first change, they break the tab contents (they are empty)
        if (!this.spec) {
          this.headerConfig = this.getHeaderConfig(spec);
          this.contentConfig = this.getContentConfig(spec);
          this.currentTab = spec ? this.contentConfig[0].id : 'spec';
        }
        this.spec = spec;
        this.footerConfig = this.getFooterConfig(spec, folder);
        this.sections = this.specService.addSectionsFromSpec(this.spec, [...sectionConfig]);
      });

    this.specService.getClientSpecAndSuggestions(specUid);
  }

  //TODO: Saving favourite build
  handleSavedToggled(specUid, saved) {
    this.preference.handleSavedItemToggle('specs', specUid, saved);
  }

  private getHeaderConfig(spec) {
    if (!spec) {
      return {};
    }
    const isSaved = this.preference.savedSpecs?.[spec.uid];
    this.isDesktop = this.windowService.isDesktop;
    const savedColour = this.isDesktop ? COLOURS.white : COLOURS.bluePrimary;
    const nonSavedColour = this.isDesktop ? COLOURS.white : 'gray';

    return {
      title: `Lot ${spec.section_details.lot} ${spec.section_details.subdivision}`,
      barActions: [
        {
          icon: 'star',
          label: 'Favourite',
          action: () => this.handleSavedToggled(spec.uid, !(isSaved || false)),
          colours: { true: savedColour, false: nonSavedColour },
          filled: isSaved || false,
        },
      ],
      menuActions: [],
    };
  }

  private getContentConfig(spec) {
    if (!spec) {
      return null;
    }

    return [
      {
        label: 'SPEC',
        id: 'spec',
        component: SpecTabContentComponent,
        data: { spec: spec },
      },
      { label: 'QUOTE', id: 'quote', component: QuoteTabContentComponent, data: { spec } },
      { label: 'SUBBIES', id: 'subbies', component: SubbieJobBoardComponent, data: spec.uid, dataKey: 'specUid' },
      { label: 'EXTRAS', id: 'extras', component: ExtraTabContentComponent, data: { spec } },
      { label: 'FILES', id: 'files', component: FilesTabContentComponent, data: spec.uid, dataKey: 'specUid' },
    ];
  }

  private getFooterConfig(spec, folder): AppChromeDetailsPageFooterConfig | undefined {
    if (!spec) {
      return;
    }
    return {
      type: 'forceSpeedDial',
      actions: [
        {
          icon: 'sync',
          label: () => 'Sync with Freedom',
          hide: !spec.disabled || !spec?.details?.synced,
          action: () => this.syncWithFreedom(),
          tabs: ['spec'],
        },
        {
          icon: 'timeline',
          label: () => 'Spec History',
          hide: !spec.disabled,
          action: () => this.specHistory(),
          tabs: ['spec'],
        },
        {
          icon: 'add_a_photo',
          label: () => 'Save a Copy',
          hide: !spec.disabled,
          action: () => this.takeASnapshot(),
          tabs: ['spec'],
        },
        {
          icon: 'history',
          label: () => 'Restore Saved Copy',
          hide: !spec.disabled,
          action: () => this.restoreSavedCopy(),
          tabs: ['spec'],
        },
        {
          icon: 'share',
          label: () => 'Share',
          hide: !spec.disabled,
          primary: true,
          action: () => this.share(), //need to handle spec and quote sharing separately (maybe)
          shownOnDesktop: true,
          tabs: ['spec'],
        },
        {
          icon: 'reorder',
          label: () => 'Re-order spec',
          hide: spec.disabled,
          action: () => this.reOrderSection(),
          tabs: ['spec'],
        },
        {
          icon: 'add',
          label: () => 'Add new section',
          hide: spec.disabled,
          action: () => this.addANewSecton(),
          tabs: ['spec'],
        },
        {
          icon: 'track_changes',
          label: () => 'Tracked Mode',
          hide: spec.disabled,
          action: () => this.trackedChanges(),
          tabs: ['spec'],
        },
        {
          icon: 'share',
          label: () => 'Share',
          primary: true,
          action: () => this.share(),
          shownOnDesktop: true,
          tabs: ['quote', 'files'],
        },
        {
          icon: 'share',
          label: () => 'Share',
          primary: true,
          hide: !spec.details.postContract,
          action: () => this.share(),
          tabs: ['extras'],
        },
        {
          //File upload button is special. We don't need to add action here, as we need to get use Form Input upload, we put
          // the action in speed dial. But we need to provide specUid and folder here.
          icon: 'file_upload',
          label: () => 'Upload File',
          hide: this.folderService.getCurrentFolder == 'Checklists', //hide on checklist
          primary: true,
          data: {
            specUid: spec.uid,
            folder: folder,
          },
          tabs: ['files'],
        },
        {
          icon: 'create_new_folder',
          label: () => 'Add Folder',
          hide: this.folderService.getCurrentFolder != 'root', //TODO: make it reactive
          primary: true,
          action: () => this.addFolder(),
          tabs: ['files'],
        },
        {
          icon: 'edit',
          // needs to be a method so it's dynamic
          // originally I planned to update the value each time spec changed, but updating the configs on each spec change goes badly
          label: () => this.getEditLabel(),
          action: () => this.handleEdit(),
          tabs: ['spec'],
        },
        {
          icon: 'edit',
          hide: spec.details.postContract,
          label: () => 'Edit',
          action: () => this.handleEdit(),
          tabs: ['quote'],
        },
        {
          icon: 'edit',
          hide: !spec.details.postContract,
          label: () => 'Edit',
          action: () => this.handleEdit(),
          tabs: ['extras'],
        },
        {
          icon: 'add',
          label: () => 'Add a new Job',
          action: () => this.addAJob(spec.uid),
          shownOnDesktop: true,
          primary: true,
          tabs: ['subbies'],
        },
      ],
    };
  }

  private handleEdit() {
    switch (this.currentTab) {
      case 'spec':
        this.specService.editSpecMode();
        break;
      case 'quote':
      case 'extras':
        this.dialogService.open(EditQuoteComponent, {
          data: {
            uid: this.spec.uid,
            spec: this.spec,
            quote: this.spec.quote,
            quoteTab: this.currentTab == 'quote',
          },
          dialogTitle: this.currentTab == 'quote' ? 'Edit Quote' : 'Edit Extras',
        });
        break;
      default:
        break;
    }
  }

  private addAJob(specUid) {
    this.dialogService.open(SubbieJobDetailComponent, {
      data: {
        uid: specUid,
      },
      dialogTitle: 'Add a new Job',
    });
  }

  private getEditLabel() {
    return this.specActiveService.getActiveSpec()?.disabled ? 'Edit Spec' : 'Exit Edit Mode';
  }

  private share() {
    this.dialogService.open(ShareSpecComponent, {
      data: {
        uid: this.spec.uid,
        spec: this.spec,
        quote: this.spec.quote,
      },
      dialogTitle: 'Share' + (this.isDesktop ? ` the Spec Sheet for ${this.spec.contact_details.client}` : ''),
      size: DialogSize.Large,
    });
  }

  private restoreSavedCopy() {
    this.dialogService.open(RestoreSnapshotComponent, {
      data: {
        uid: this.spec.uid,
        spec: this.spec,
      },
      dialogTitle: 'Restore Saved Copy',
      size: DialogSize.Large,
    });
  }

  private takeASnapshot() {
    this.dialogService.open(TakeSnapshotComponent, {
      data: {
        uid: this.spec.uid,
        spec: this.spec,
        quote: this.spec.quote,
      },
      dialogTitle: 'Save a Copy',
    });
  }

  private specHistory() {
    this.dialogService.open(SpecAuditComponent, {
      data: {
        uid: this.spec.uid,
        sections: this.specService.addSectionsFromSpec(this.spec, sectionConfig),
      },
      dialogTitle: 'Spec History',
      size: DialogSize.Large,
    });
  }

  private syncWithFreedom() {
    const snackId = this.snackBarService.open('Syncing with Freedom…', undefined, { duration: 0 });
    this.clientService
      .getClientInfo(this.spec.uid)
      .pipe(switchMap((client: ClientModel) => this.exportService.exportSpec(this.spec, client.lot)))
      .pipe(this.takeUntilDestroy())
      .subscribe(
        (res) => {
          this.snackBarService.close(snackId);
          this.snackBarService.open('Synced', undefined, { duration: 3000 });
        },
        (err) => {
          this.snackBarService.close(snackId);
          this.snackBarService.open('Sync failed, please try again', undefined, { duration: 3000 });
        }
      );
  }

  private trackedChanges() {
    if (this.spec == undefined) {
      return;
    }
    if (this.trackingService.trackChangesEnabled) {
      this.dialogService.open(SpecTrackChangesComponent, {
        data: {
          spec: this.spec,
        },
        dialogTitle: 'Tracked Changes',
        size: DialogSize.Large,
      });
    } else {
      this.trackingService.enableTracking();
      this.trackingService.openTrackChangesSnackBar(this.spec);
    }
  }

  private addANewSecton() {
    this.dialogService.open(SpecAddNewSectionComponent, {
      data: {
        sections: this.sections,
        spec: this.spec,
      },
      dialogTitle: 'Add new section',
      size: DialogSize.Large,
    });
  }

  private reOrderSection() {
    this.dialogService.open(SpecReOrderComponent, {
      data: {
        sections: this.sections,
        spec: this.spec,
      },
      dialogTitle: 'Re-order Spec',
      size: DialogSize.Large,
    });
  }

  private addFolder() {
    let newFolderName = 'New Folder';

    this.folderService.folders.pipe(first()).subscribe((folders) => {
      if (folders.indexOf(newFolderName) > -1) {
        const length = folders.filter((folder) => folder.indexOf(newFolderName) > -1).length;
        newFolderName = `${newFolderName}(${length})`;
      }

      this.folderService.addFolder(this.spec.uid, newFolderName).then(() => {
        this.folderService.getFolders(this.spec.uid);
      });
    });
  }
}
