import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { filter, takeUntil } from 'rxjs/operators';

import { ActivatedRoute } from '@angular/router';
import { AuditService } from '@services/spec/audit.service';
import { CONSULTANTS } from '@shared/config/spec-config/consultants';
import { ClientService } from '../../../+clients/services/client.service';
import { ClientSpec } from '@interfaces/client-spec.interface';
import { DrawerContent } from '@shell/drawer/drawer-content.type';
import { DrawerService } from '@shell/drawer/drawer.service';
import { EVENT_TYPES } from '@shell/drawer/drawer-content.interfaces';
import { EditQuoteComponent } from '@shell/drawer/edit-quote/edit-quote.component';
import { ExtrasService } from '@services/spec/extras.service';
import { FolderService } from 'src/+files/src/services/folder.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import { PROJECT_MANAGERS } from '@shared/config/spec-config/projectMangers';
import { ShareExtrasDialogComponent } from '../share-extras-dialog/share-extras-dialog.component';
import { ShareSpecComponent } from '@shell/drawer/share-spec/share-spec.component';
import { SnapshotService } from '@services/spec/snapshot.service';
import { SpecActiveService } from '@services/spec/spec.active.service';
import { SpecAddNewSectionComponent } from '../../../../shell/drawer/spec-add-new-section/spec-add-new-section.component';
import { SpecReOrderComponent } from '@shell/drawer/spec-re-order/spec-re-order.component';
import { SpecService } from '@services/spec/spec.service';
import { SpecTrackChangesComponent } from '@shell/drawer/spec-track-changes/spec-track-changes.component';
import { SubbieJobDetailComponent } from '@jobs/components/subbie-job-detail/subbie-job-detail.component';
import { Subject } from 'rxjs';
import { TrackingService } from '@services/spec/tracking.service';
import { WindowService } from '@services/window.service';
import { sectionConfig } from '@shared/config/spec-config';

@Component({
  selector: 'ven-spec-page',
  templateUrl: './spec-page.component.html',
  styleUrls: ['./spec-page.component.scss'],
  // changeDetection: ChangeDetectionStrategy.Default
  // if onPush is used here, when a field is updated, the green flash continues for ever
})
export class SpecPageComponent implements OnInit, OnDestroy {
  @ViewChild('clientTab', { static: true }) clientTab: MatTabGroup;

  public spec: ClientSpec;
  public folders$: any;
  // @ts-ignore
  public sections = [...sectionConfig];
  public showContents = true;
  public showDownloadShield = false;
  public selectedTab = 0;
  public isMobile = false;
  public isTablet = false;
  public currentlySelectedFileFolder;
  public showEditExtrasButton = false;
  public trackingEnabled = false;

  public consultants = CONSULTANTS || [];
  public projectManagers = PROJECT_MANAGERS || [];

  public uid;
  public quote;
  public subbieJobs$;
  public fabButtonOpened = false;

  private destroy$ = new Subject<any>();

  @HostListener('window:resize')
  checkIfMobile() {
    this.isMobile = this.windowService.isMobile || false;
    this.isTablet = this.windowService.isTablet || false;
  }

  constructor(
    public dialog: MatDialog,
    public specService: SpecService,
    private auditService: AuditService,
    private extrasService: ExtrasService,
    private drawerService: DrawerService,
    private windowService: WindowService,
    private snapshotService: SnapshotService,
    private folderService: FolderService,
    private route: ActivatedRoute,
    private clientService: ClientService,
    public trackingService: TrackingService,
    private specActiveService: SpecActiveService
  ) {}

  ngOnDestroy() {
    if (this.clientService.getActiveClient()) {
      this.clientService.cleanActiveClient();
    }
    this.specActiveService.closeSection();
    this.specActiveService.closeSectionAction();
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.uid = this.route.snapshot.paramMap.get('uid');
    this.isMobile = this.windowService.isMobile;
    this.isTablet = this.windowService.isTablet;
    this.folderService.currentFolder.pipe(takeUntil(this.destroy$)).subscribe((folder) => (this.currentlySelectedFileFolder = folder));
    this.specActiveService.activeSpec$.pipe(takeUntil(this.destroy$)).subscribe((spec) => {
      this.spec = spec;
      if (this.spec) {
        this.spec.quote.includeGST = spec.quote.includeGST === undefined ? true : spec.quote.includeGST;
        this.sections = this.specService.addSectionsFromSpec(this.spec, [...sectionConfig]);

        this.specActiveService.activeSectionAction$
          .pipe(takeUntil(this.destroy$))
          .subscribe((activeSection) => this.handleSectionActionClicked(activeSection));

        this.specService.emitNewSection.pipe(takeUntil(this.destroy$)).subscribe(() => {
          this.handleSectionActionClicked(1);
        });
      }
    });

    this.auditService.getSpecAudit(this.uid).pipe(takeUntil(this.destroy$)).subscribe();

    this.snapshotService.refreshRequired$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.specService.getClientSpecAndSuggestions(this.uid);
    });

    this.specActiveService.selectedTab$.pipe(takeUntil(this.destroy$)).subscribe((idx) => {
      this.selectedTab = idx;
    });

    this.specService.getClientSpecAndSuggestions(this.uid);

    // always start on tab 0 (handles scenario where user exits spec on higher tab)
    this.specActiveService.updateSelectedTab(0);

    this.resumeTrackingFromDrawer();
  }

  onEditQuoteClick() {
    const currentSpec: any = this.specService.getCopyOfCurrentSpec();
    this.drawerService.open(
      new DrawerContent(EditQuoteComponent, {
        uid: this.uid,
        quote: currentSpec.quote,
        spec: currentSpec,
        quoteTab: this.selectedTab === 1,
      })
    );
  }

  onCreateSubbieJob() {
    const currentSpec: any = this.specService.getCopyOfCurrentSpec();
    this.drawerService.open(
      new DrawerContent(SubbieJobDetailComponent, {
        uid: this.uid,
        projectManagerEmail: this.spec.quote.projectManagerEmail,
      })
    );
  }

  handleTabChange(selectedTab) {
    if (this.trackingService.trackChangesEnabled && selectedTab.index !== 0) {
      this.showTrackingDialog(selectedTab);
    } else {
      if (selectedTab.index !== 0 && !this.spec.disabled) {
        this.specService.editSpecMode();
      }
      this.specActiveService.updateSelectedTab(selectedTab.index);
      this.showContents = selectedTab.index === 0;
      this.specActiveService.closeSection();
      this.showEditExtrasButton =
        (selectedTab.index === 1 && !this.spec.details.postContract) || (selectedTab.index === 2 && this.spec.details.postContract);
    }
    this.specActiveService.updateSelectedTab(selectedTab.index);
    this.showContents = selectedTab.index === 0;
    this.specActiveService.closeSection();
    this.showEditExtrasButton =
      (selectedTab.index === 1 && !this.spec.details.postContract) ||
      (selectedTab.index === 3 && this.spec.details.postContract && this.spec.details.status !== 'Completed');
  }

  handleSectionActionClicked(sectionId) {
    if (sectionId === 1) {
      this.drawerService.open(
        new DrawerContent(SpecAddNewSectionComponent, {
          sections: this.sections,
          spec: this.spec,
        })
      );
    } else if (sectionId === 2) {
      this.drawerService.open(
        new DrawerContent(SpecReOrderComponent, {
          sections: this.sections,
          spec: this.spec,
        })
      );
    }
  }

  showTrackingDialog(selectedTab?) {
    if (this.trackingService.trackChangesEnabled) {
      if (selectedTab) {
        this.trackingService
          .showAlertDialog()
          .afterClosed()
          .subscribe((res: string) => {
            switch (res) {
              case 'exit':
                this.disableTracking();
                this.handleTabChange(selectedTab);
                break;

              case 'view':
                this.viewSpecChanges(selectedTab.index);
                break;

              case 'resume':
                if (selectedTab) {
                  selectedTab.index = this.clientTab.selectedIndex = 0;
                  this.handleTabChange(selectedTab);
                }
                break;

              default:
                break;
            }
          });
      } else {
        this.viewSpecChanges();
      }
    } else {
      this.enableTracking();
    }
  }

  private disableTracking() {
    this.trackingService.disableTracking();
  }

  private enableTracking() {
    this.trackingService.enableTracking();
    this.trackingService.openTrackChangesSnackBar(this.spec);
  }

  private viewSpecChanges(selectedTab?: number) {
    this.drawerService.open(
      new DrawerContent(SpecTrackChangesComponent, {
        spec: this.spec,
        selectedTab,
      })
    );
  }

  private resumeTrackingFromDrawer() {
    this.drawerService.events$
      .pipe(
        filter((event: any) => event.type === EVENT_TYPES.resumeTracking || event.type === EVENT_TYPES.exitTracking),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => {
        if (data.type === EVENT_TYPES.resumeTracking) {
          this.clientTab.selectedIndex = 0;
        } else if (data.type === EVENT_TYPES.exitTracking && data.data) {
          this.specActiveService.updateSelectedTab(data.data);
          this.showContents = this.showEditExtrasButton = false;
        }
      });
  }

  canDeactivate() {
    const currentSpec: any = this.specService.getActiveSpec();

    if (this.specActiveService.extrasNeedSharing) {
      const dialogRef = this.dialog.open(ShareExtrasDialogComponent, {
        panelClass: 'full-width-dialog',
        width: this.isMobile ? '100%' : '50%',
        data: {
          client: currentSpec.details.client,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        this.specActiveService.markExtraAsShared();
        if (result) {
          this.drawerService.open(
            new DrawerContent(ShareSpecComponent, {
              uid: currentSpec.uid,
              spec: currentSpec,
              quote: currentSpec.quote,
            })
          );
          return true;
        }
        return true;
      });
    }

    return true;
  }
}
