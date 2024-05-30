import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { errorsConfig, sectionConfig } from '@shared/config/spec-config';

import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { Checklist } from '@interfaces/checklist.data';
import { ChecklistService } from '@services/checklist.service';
import { ClientModel } from '@interfaces/client-model';
import { ClientService } from 'src/-venture/+clients/services/client.service';
import { ClientSpec } from '@interfaces/client-spec.interface';
import { ConfirmationDialogComponent } from '@shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { DrawerService } from '@shell/drawer/drawer.service';
import { EVENT_TYPES } from '@shell/drawer/drawer-content.interfaces';
import { ExtrasService } from '@services/spec/extras.service';
import { FOLDERS_NAMES } from '@shared/config/spec-config/folders.config';
import { FileService } from 'src/+files/src/services/file.service';
import { FolderService } from 'src/+files/src/services/folder.service';
import { KeypressService } from '@services/keypress.service';
import { LoggerService } from '@services/logger.service';
import { LogicService } from '@services/spec/logic.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PrintChromeDialogComponent } from '../print-chrome-dialog/print-chrome-dialog.component';
import { ShareService } from '@services/spec/share.service';
import ShareType from 'src/-venture/+spec/components/share-type.enum';
import { SnapshotService } from '@services/spec/snapshot.service';
import { SpecActiveService } from '@services/spec/spec.active.service';
import { SpecService } from '@services/spec/spec.service';
import { SpecUtilityService } from '@services/spec/spec.utility.service';
import { Subject } from 'rxjs';
import { WindowService } from '@services/window.service';
import createLogger from 'debug';
import { takeUntil } from 'rxjs/operators';

const logger = createLogger('ven:venture:print');

@Component({
  selector: 'ven-print-page',
  templateUrl: './print-page.component.html',
  styleUrls: ['./print-page.component.scss'],
})
export class PrintPageComponent implements OnInit, OnDestroy {
  public spec: ClientSpec;
  public checklists: Checklist[];
  public customValuesPathList: string[] = [];
  public logoImage = '/assets/img/pdf-logo.png';
  public sections;

  public extras;
  public consultant;

  public printSpec: boolean = false;
  public printExtras: boolean = false;
  public printQuote: boolean = false;
  public printChecklists: boolean = false;
  public printPricingSummary: boolean = false;
  public printChecklistIds: number[];
  public progress: string;
  public isNotChrome = false;
  public currentClient: ClientModel;
  public safetySignature: string;
  public isSigned;

  private isMobile = false;
  public specId;
  private shareCode;
  public snapshotId; // for pricing summary sharing, we set this with pricingUid
  private snapshot;
  private _destroy$ = new Subject<any>();
  public todaysDate = Date.now();

  public optionId;
  public pricingClient;

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private logger: LoggerService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private windowService: WindowService,
    private snapshotService: SnapshotService,
    private extrasService: ExtrasService,
    private route: ActivatedRoute,
    public specService: SpecService,
    private keyService: KeypressService,
    private logicService: LogicService,
    private checklistService: ChecklistService,
    private folderService: FolderService,
    private fileService: FileService,
    private clientService: ClientService,
    private drawerService: DrawerService,
    private shareService: ShareService,
    private specUtilityService: SpecUtilityService,
    private specActiveService: SpecActiveService
  ) {}

  ngOnInit() {
    // ensure we can scroll the whole page

    this.windowService.addBodyClass('print-page');
    this.windowService.addBodyClass('do-scroll');

    this.sections = sectionConfig;
    this.isMobile = this.windowService.isMobile;
    this.isNotChrome = !this.windowService.isChrome();
    const paramMap = this.route.snapshot.paramMap;
    this.specId = paramMap.get('uid');
    this.shareCode = paramMap.get('share');
    this.snapshotId = paramMap.get('sid');
    this.optionId = paramMap.get('optionid');
    this.decodeParam(this.shareCode);

    if (this.printChecklists) {
      const remainingParams = this.shareCode.slice(5, this.shareCode.length).split('');
      this.printChecklistIds = this.shareService.convertCheckListParamsToIds(remainingParams);
    }

    console.group('sharing');
    console.log(`spec ID = ${this.specId}`);
    console.log(`snapshot ID = ${this.snapshotId}`);
    console.log(`print spec = ${this.printSpec}`);
    console.log(`print extras = ${this.printExtras}`);
    console.log(`print quote = ${this.printQuote}`);
    console.log(`print checklists = ${this.printChecklists}`);
    console.log(`print pricing summary = ${this.printPricingSummary}`);
    console.log(`checklists = ${JSON.stringify(this.printChecklistIds)}`);
    console.log(`isSigned = ${this.isSigned}`);
    console.groupEnd();

    this.keyService.printSelected$.subscribe(() => {
      this.print();
    });

    this.specActiveService.activeSpec$.subscribe((spec) => {
      if (!spec) {
        return;
      }
      this.spec = spec;
      this.pricingClient = {
        client: spec.contact_details.client,
        lot: spec.section_details.lot,
        subdivision: spec.section_details.subdivision,
      };
    });

    this.drawerService.events$.subscribe((event) => {
      if (event.type === EVENT_TYPES.signSection) {
        this.signSection(event.data.sectionName, event.data.signature);
      } else if (event.type === EVENT_TYPES.signAll) {
        this.signAllSections(event.data);
      }
    });

    this.authService.authUser$.subscribe((authUser) => {
      logger('auth state changed');
      // don't attempt to fetch anything until logged in as anon user
      if (!authUser) {
        // TODO MIGRATE validate works as expected
        logger('unauthenticated');
        return;
      }
      this.loadPage();
    });

    // all database calls require a token, but this screen can be shared with non users
    // therefore if not already logged, login with anon user
    if (!this.authService.isAuthenticated) {
      logger('no user logged in => login as anon');
      this.authService.signinAnon(); // TODO this is not working
    }
  }

  loadPage() {
    if (!this.printPricingSummary) {
      if (typeof this.snapshotId === 'string') {
        logger(`authd => getting snapshot ${this.specId}, ${this.snapshotId}`);
        // get snapshot spec and quote and assign to locals
        this.snapshotService.getSnapshot(this.specId, this.snapshotId).subscribe((snap) => {
          const snapshot: any = snap;
          if (snapshot == undefined) {
            this.logger.error(`could not find snapshot ${this.snapshotId} for ${this.specId}`);
            return;
          }
          if (snapshot.spec == undefined && this.printSpec) {
            this.logger.error(`could not find spec in snapshot ${this.snapshotId} for ${this.specId}`);
            return;
          }
          if (snapshot.spec.quote == undefined && this.printQuote) {
            this.logger.error(`could not find quote in snapshot ${this.snapshotId} for ${this.specId}`);
            return;
          }

          if (!snapshot.spec.signatures) {
            snapshot.spec.signatures = {};
          }

          this.isSigned = snapshot.spec.signatures.spec;

          this.spec = snapshot.spec;
          this.customValuesPathList = this.spec?.custom_value;
          console.log(this.spec?.custom_value);

          if (snapshot && snapshot.includedSpec) {
            this.printSpec = true;
          }

          if (this.printQuote || this.printExtras) {
            this.spec.quote.includeGST = snapshot.spec.quote.includeGST === undefined ? true : snapshot.spec.quote.includeGST;
          }
          if (this.spec['custom_fields']) {
            this.spec['custom_fields'] = this.specUtilityService.addSlash(this.spec);
          }
          this.snapshot = snap;
          this.sections = this.specService.addSectionsFromSpec(this.spec, this.sections);
          if (snapshot.spec) {
            this.extras = this.getExtras(snapshot.spec);
          }
          if (this.printChecklists) {
            this.getChecklists(this.printChecklistIds);
          }
        });
      } else if (this.snapshotId === -1 || this.snapshotId === 0 || this.snapshotId === null) {
        logger(`authd => snapshot ID was ${this.snapshotId} for spec: ${this.specId} `);
        if (this.printChecklists) {
          logger(`authd => getting checklists for spec: ${this.specId}`);
          this.specService.getClientSpec(this.specId);
          this.getChecklists(this.printChecklistIds);
        } else {
          logger(`authd => snapshot ID was -1 but not sharing checklists for spec: ${this.specId} ???`);
        }
      } else {
        logger(`authd => snapshot ID was ${this.snapshotId} for spec: ${this.specId} `);
      }
    }
    // this is required for the template to recognise that spec has been loaded.
    this.cdr.detectChanges();
    this.getClientInfo();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private getClientInfo() {
    logger('get client info');
    this.clientService
      .getClientInfo(this.specId)
      .pipe(takeUntil(this._destroy$))
      .subscribe((res: ClientModel) => {
        this.currentClient = res;
      });
  }

  private getExtras(spec) {
    let extras;
    if (!this.printSpec && this.printExtras) {
      // if share EXTRAS ONLY - show optional extras in extras, only if postContract
      extras = this.extrasService.getPostContractExtras(spec, this.sections);
    } else if (this.printSpec && this.printExtras) {
      // get post contrat extras for extras section
      extras = this.extrasService.getPostContractExtras(spec, this.sections);
      if (extras['electrical']) {
        // if show optional extras in spec
        const validOptionalExtras = extras['electrical'].extras.filter((e) => e.optional).map((e) => ({ ...e, amount: 0 }));
        if (validOptionalExtras.length > 0) {
          extras['electrical_optional'] = validOptionalExtras;
        }
        // dont display optional extras in extras section when also displaying spec
        const validExtras = extras['electrical'].extras.filter((e) => !e.optional && e.postContract);
        if (validExtras.length > 0) {
          extras['electrical'].extras = validExtras;
        }
      }
    } else if (this.printSpec) {
      // if share SPEC ONLY - show optional extras in spec
      extras = this.extrasService.getAllExtraSections(spec);
      if (extras['electrical']) {
        const validOptionalExtras = extras['electrical'].extras.filter((e) => e.optional).map((e) => ({ ...e, amount: 0 }));
        if (validOptionalExtras.length > 0) {
          extras['electrical_optional'] = validOptionalExtras;
        }
      }
    }
    return extras;
  }

  private decodeParam(shareCode) {
    const decoded = this.shareService.decodeShareCode(shareCode);
    this.printSpec = decoded.printSpec;
    this.printExtras = decoded.printExtras;
    this.printQuote = decoded.printQuote;
    this.printChecklists = decoded.printChecklists;
    this.printPricingSummary = decoded.printPricingSummary;
  }

  private getChecklists(checklistIds) {
    logger(`checklistIds = ${checklistIds}`);
    this.checklistService.getAllChecklists(this.specId).subscribe((cls) => {
      logger(`fetched ${cls.length} checklists`);
      const selected = cls.filter((cl) => checklistIds.includes(cl.id));
      logger(`${selected.length} are selected`);
      this.checklists = selected;
    });
  }

  public print() {
    if (this.windowService.isChrome()) {
      this.windowService.windowRef.print();
    } else {
      // if not on chrome show a dialog first
      const dialogRef = this.dialog.open(PrintChromeDialogComponent, {
        panelClass: 'full-width-dialog',
        width: this.isMobile ? '100%' : '50%',
        data: {
          link: this.windowService.windowRef.location.href,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.windowService.windowRef.print();
        }
      });
    }
  }

  public findFieldError(sectionName, block, fieldName) {
    // currently only custom cladding section has errors
    // if errors are added elsewhere this will need to be revisited.
    const potentialErrors = errorsConfig.filter((e) => e.field === fieldName || e.sourceField === fieldName);
    let errorMsg = null;
    for (let e = 0; e < potentialErrors.length; e++) {
      const error = potentialErrors[e];
      if (error.field === fieldName || error.sourceField === fieldName) {
        const currentSpec = this.specService.getActiveSpec();
        if (currentSpec) {
          const fieldValue = currentSpec[sectionName][block][error.field];
          const sourceValue = currentSpec[sectionName][block][error.sourceField];
          const errorFound = error.method(fieldValue, sourceValue) ? error.msg : null;
          if (errorFound) {
            errorMsg = errorFound;
          }
        }
      }
    }
    return errorMsg;
  }

  getSectionClass(section) {
    // some sections require slightly different styling
    switch (section.name) {
      case 'garage':
      case 'exterior':
        return 'section-dashed';
      default:
        return '';
    }
  }

  getSectionFields(section) {
    return section.fields.filter((f) => f.type !== 'subtitle' && f.type !== 'note');
  }

  getFieldValue(section, field) {
    if (!this.spec[section.name]) {
      return 'n/a';
    }
    return this.spec[section.name][field.name] ? this.spec[section.name][field.name] : 'n/a';
  }

  getImage(section, field) {
    if (!this.spec[section.name][field.name]) {
      return undefined;
    }
    const selected = field.items.filter((i) => i.id === this.spec[section.name][field.name])[0];
    if (selected) {
      return selected;
    }
    return undefined;
  }

  getColour(section, field) {
    if (!this.spec[section.name]) {
      return undefined;
    }
    if (!this.spec[section.name][field.name]) {
      return undefined;
    }
    const items = field.items.filter((i) => i.id === this.spec[section.name][field.name]);
    return items && items.length > 0 ? items[0] : undefined;
  }

  displayConditional(section, field) {
    return this.logicService.displayConditionalField(this.spec, section, field);
  }

  public onSubmit(data) {
    this.createCopySpec(data);
  }

  private createCopySpec(data) {
    const signedSpec = this.safetySignature || this.snapshot.spec.signatures.spec;
    // is signed if the spec is signed and all sections signed. Note signatures object contains spec signature, hence the -1
    const allSigned = signedSpec && this.sections.length === Object.keys(this.snapshot.spec.signatures).length - 1;

    if (!allSigned) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        panelClass: 'full-width-dialog',
        width: this.isMobile ? '100%' : '50%',
        data: {
          title: 'Are you sure?',
          text: 'There are sections of the spec that have not been signed. Are you sure you still want to submit?',
          btnAccept: 'Submit',
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.saveSignedSpec(data);
        }
      });
    } else {
      this.saveSignedSpec(data);
    }
  }

  /**
   * Creates a 'file' in the Signed Spec sheets folder.
   * This does not link to a physical file, but rather to share screen of the spec.
   */
  public saveSignedSpec(data) {
    const folder = FOLDERS_NAMES.signedSpecSheet;
    const description = `${this.snapshot.description} - signed`;
    this.snapshotService.signSnapshot(this.snapshot.spec.uid, this.snapshotId, this.snapshot, description).subscribe(
      () => {
        this.folderService
          .addFolder(this.spec.uid, folder)
          .then(() => {
            this.fileService.addedSignedFile(this.spec.uid, folder, this.snapshotId, {
              date: Date.now(),
              filename: description,
              url: this.shareService.getShareUrl(this.snapshot.spec.uid, this.snapshotId, ShareType.Spec),
              printSpec: true,
            });
            this.isSigned = true;
          })
          .catch((error) => {
            this.snackBar.open('Sorry, submission failed', null, { duration: 5000 });
            this.logger.error(error);
          });
      },
      (error) => {
        this.snackBar.open('Sorry, submission failed', null, { duration: 5000 });
        this.logger.error(error);
      }
    );
  }

  // NOTE: we only sign the local copy of the snapshot, the DB is not updated until the user clicks Submit
  signSection(sectionName: string, signature: string) {
    if (sectionName === 'HealthAndSafety') {
      this.safetySignature = signature;
      this.snapshot.spec.signatures.spec = signature;
    } else {
      if (!this.snapshot.spec.signatures) {
        this.snapshot.spec.signatures = {};
      }
      this.snapshot.spec.signatures[sectionName] = signature;
    }
  }

  // NOTE: we only sign the local copy of the snapshot, the DB is not updated until the user clicks Submit
  signAllSections(signature: string) {
    if (!this.snapshot.spec.signatures) {
      this.snapshot.spec.signatures = {};
    }
    Object.values(this.sections).forEach((value: any) => {
      if (this.snapshot.spec.hasOwnProperty(value.name)) {
        this.snapshot.spec.signatures[value.name] = signature;
      }
    });
    // add signature to custom sections
    if (this.snapshot.spec && this.snapshot.spec.custom_sections) {
      Object.values(this.snapshot.spec.custom_sections).forEach((value: any) => {
        if (this.snapshot.spec.hasOwnProperty(value.name)) {
          this.snapshot.spec.signatures[value.name] = signature;
        }
      });
    }
    this.snapshot.spec.signatures.spec = signature;
    this.safetySignature = signature;
  }
}
