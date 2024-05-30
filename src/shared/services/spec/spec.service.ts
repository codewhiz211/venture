import { EventEmitter, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, first, map, switchMap, tap } from 'rxjs/operators';
import { clone, filter, keys, mergeDeepLeft } from 'ramda';

import { AuditService } from './audit.service';
import { ClientActiveService } from './client.active.service';
import { ClientSpec } from '../../interfaces/client-spec.interface';
import { ConfirmationDialogComponent } from '@shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { DialogService } from '@shell/dialogs/dialog.service';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SentryService } from '@services/sentry.service';
import { SpecActiveService } from './spec.active.service';
import { SpecDBService } from './spec.db.service';
import { SpecFormatterService } from './spec.formatter.service';
import { SpecUtilityService } from './spec.utility.service';
import { SubbieJobService } from './subbie-job.service';
import { SuggestionService } from './suggestion.service';
import { sectionConfig } from '@shared/config/spec-config';
import { serviceLogger } from '@services/serviceLogger';

@Injectable({
  providedIn: 'root',
})
export class SpecService {
  public emitNewSection = new EventEmitter();

  constructor(
    private specUtilityService: SpecUtilityService,
    public snackBar: MatSnackBar,
    private http: HttpClient,
    private specDbService: SpecDBService,
    private auditService: AuditService,
    private suggestionService: SuggestionService,
    private clientActiveService: ClientActiveService,
    private activeSpecService: SpecActiveService,
    private specFormatterService: SpecFormatterService,
    private subbieJobService: SubbieJobService,
    private dialogService: DialogService,
    private sentryService: SentryService
  ) {}

  public getActiveSpec(): ClientSpec {
    return this.activeSpecService.getActiveSpec();
  }

  /**
   * Usually when we load the spec, we want to fetch any suggestions.
   * Use this method to do that
   * @param uid
   */
  public getClientSpecAndSuggestions(uid) {
    const activeClient = this.clientActiveService.getActiveClient();
    let spec;
    // to consume the result subscribe to activeSpec$
    this.specDbService
      .getClientSpec(uid)
      .pipe(
        switchMap((data) => {
          spec = { uid, ...data, disabled: !activeClient };
          return this.suggestionService.getSuggestions();
        })
      )
      .subscribe((suggestions) => {
        spec['custom_fields'] = this.configureCustomFields(spec);
        spec['suggestions'] = suggestions;
        this.activeSpecService.initialiseActiveSpec(spec);
      });
  }

  /**
   * Sometimes we don't want to fetch suggestions, e.g. when sharing the spec
   * @param uid
   */
  public getClientSpec(uid) {
    // to consume the result subscribe to activeSpec$
    this.specDbService.getClientSpec(uid).subscribe((spec) => {
      if (!spec['custom_fields']) {
        spec['custom_fields'] = {};
      } else {
        spec['custom_fields'] = this.specUtilityService.addSlash(spec);
      }
      this.activeSpecService.updateActiveSpec({ ...spec, uid });
    });
  }

  /**
   * Remove custom value for the sectionName/fieldName from this spec
   * @param sectionName
   * @param fieldName
   */
  public dismissCustomValue(sectionName, fieldName) {
    const currentSpec = this.getActiveSpec();
    const specChanges = this.specFormatterService.getDismissCustomValueChange(currentSpec, sectionName, fieldName);
    return this.activeSpecService.updateSpec(currentSpec.uid, specChanges);
  }

  getIsInPostContract() {
    const currentSpec = this.getActiveSpec();
    return currentSpec.details.postContract;
  }

  // E.g cladding brick seal could be on one or more custom blocks. Then we would need to check all other blocks,
  // and update the price there also.
  updateExtraAmounts(uid, allExtras, extras) {
    const currentSpec = this.getActiveSpec();
    const specChanges = this.specFormatterService.getUpdateExtrasChanges(currentSpec, allExtras, extras);
    return this.activeSpecService.updateSpec(currentSpec.uid, specChanges);
  }

  addManualExtra(sectionName, extraToAdd) {
    const currentSpec = this.getActiveSpec();
    const specChanges = this.specFormatterService.getAddManualExtra(currentSpec, sectionName, extraToAdd);
    return this.activeSpecService.updateSpec(currentSpec.uid, specChanges).pipe(
      tap(() => {
        this.showExtraAddedToast(extraToAdd);
      })
    );
  }

  removeManualExtra(uid, sectionName, index) {
    const currentSpec = this.getActiveSpec();
    const specChanges = this.specFormatterService.getRemoveManualExtra(currentSpec, sectionName, index);
    return this.activeSpecService.updateSpec(currentSpec.uid, specChanges);
  }

  /* Custom blocks are used to add one or more blocks of predefined fields
   * Examples are Cladding, Blinks, Flooring
   */
  addCustomBlock(uid, sectionName, index, block) {
    const currentSpec = this.getCopyOfCurrentSpec();
    const changes = this.specFormatterService.getAddCustomBlockChanges(currentSpec, sectionName, index, block);
    return this.activeSpecService.updateSpec(uid, changes);
  }

  removeCustomBlock(uid, sectionName, index) {
    const currentSpec = this.getCopyOfCurrentSpec();
    const changes = this.specFormatterService.getRemoveCustomBlockChanges(currentSpec, sectionName, index);
    return this.activeSpecService.writeSpec(
      uid,
      changes,
      {},
      {
        [sectionName]: true,
      }
    );
  }

  clearActiveSpec() {
    // the client name in the back button is taken from the active spec
    // when we navigate away from the spec page we need to clear it...
    this.activeSpecService.updateActiveSpec(undefined);
  }

  editSpecMode(trackChanges?: boolean) {
    const currentSpec = this.getActiveSpec();

    const disabled = !currentSpec.disabled;

    const updatedSpec = {
      ...currentSpec,
      disabled,
    };

    this.activeSpecService.updateActiveSpec(updatedSpec);

    // dont show a snackbar when track changes active as it has it's own
    if (disabled || trackChanges) {
      return;
    }
    this.openDisableSnackBar(disabled);
  }

  showExtraAddedToast(extra) {
    // TODO standardise where toasts raised
    const destination = this.getIsInPostContract() ? 'Extras' : 'Quote';
    this.snackBar.open(`$${extra.amount} for ${extra.display} has been added to ${destination}`, undefined);
  }

  /** A multi field is one which can have zero or more values. E.g. Email / Phone in Spec Header */
  updateMultiField(uid, sectionName, fieldName, changes) {
    const currentSpec = this.getActiveSpec();
    const updateChanges = this.specFormatterService.getUpdateMultiFieldChanges(currentSpec, sectionName, fieldName, changes);
    return this.activeSpecService.updateSpec(uid, updateChanges);
  }

  removeMultiField(uid, sectionName, fieldName, index) {
    const currentSpec = this.getActiveSpec();
    const updateChanges = this.specFormatterService.getRemoveMultiFieldChanges(currentSpec, sectionName, fieldName, index);
    return this.activeSpecService.updateSpec(uid, updateChanges);
  }

  // TODO test this method
  /**
   * Updates the spec in response to the user changing a field value
   * This method uses `specFormatterService.getUpdateSpecChanges` to determine the changes
   * that need to be made to the spec (might need to update multiple locations)
   * `activeSpecService.updateSpec` is then used to apply these changes to the DB (server)
   * and the local in memory spec.
   * @param uid
   * @param section
   * @param field
   * @param changes
   * @param customValue
   */
  updateSpec(uid, section, field, changes, customValue?) {
    const allChanges = clone(changes);

    // merge custom values into the changes object
    const customKeys = keys(customValue);
    if (customKeys.length) {
      customKeys.forEach((key) => {
        allChanges[`${key}_custom`] = customValue[key];
      });
    }

    const currentSpec = this.getActiveSpec();
    const specChanges = this.specFormatterService.getUpdateSpecChanges(currentSpec, section, field, allChanges);

    const extraSections = keys(specChanges.extras);
    if (extraSections.length > 0) {
      // Assumes we only add one extra at a time (currently we do)
      // Sometimes extras will contain a dummy
      const extras = filter(
        (e) => e.field == field.name,
        filter((e) => e.dummy !== true, specChanges.extras[extraSections[0]])
      );
      if (extras.length > 0) {
        this.showExtraAddedToast(extras[0]);
      }
    }

    const clientChanges = this.specFormatterService.getClientChanges(field, changes);

    return this.activeSpecService.updateSpec(uid, specChanges, clientChanges).pipe(
      tap(() => {
        // Adding the audit changes within updateSpec (using specFormatter) is not straightforward as it requires access to
        // current user and current audit list, held withing audit.service. Therefore use existing service to do this.
        this.auditService.addChangesToAuditNew(uid, this.getSectionName(section), specChanges, field.type).subscribe();
        this.updateJobInfo(uid, specChanges);
      })
    );
  }

  updateJobInfo(uid, specChanges) {
    if (specChanges.section_details?.address) {
      this.subbieJobService.updateJobsUnderSpec(specChanges.section_details, uid);
    }
  }

  /* status */
  //This is the old version of updateStatus. We keep this to get the functionality of our old shell 'venture' work correctly.
  updateStatus(uid, statusChanges) {
    const changes = {
      details: statusChanges,
    };
    return this.activeSpecService.updateSpec(uid, changes, statusChanges);
  }

  updateStatusNew(uid, status): Observable<any> {
    const changes = this.specFormatterService.getStatusChanges(status);
    if (status === 'Prepared for contract') {
      return this.confirmForContractStatus().pipe(
        first(),
        switchMap((result) => {
          if (result) {
            return this.sentUpdateStatusRequest(uid, changes);
          }
          return of();
        })
      );
    } else {
      return this.sentUpdateStatusRequest(uid, changes);
    }
  }

  sentUpdateStatusRequest(uid, changes): Observable<any> {
    return this.activeSpecService.updateSpec(uid, { details: changes }, changes).pipe(
      map(() => {
        //show snackbar
        if (changes.status === 'Completed') {
          this.snackBar.open('Build has been archived', undefined, {
            duration: 2000,
          });
        } else if (changes.status === 'Prepared for contract') {
          this.snackBar.open('Status updated and snapshot created', undefined, {
            duration: 2000,
          });
        }
      }),
      catchError((error) => {
        console.error(error.message ? error.message : error.toString());
        //show snackBar
        this.snackBar.open('Unexpected error, please try again', undefined, {
          duration: 2000,
        });
        return of();
      })
    );
  }

  confirmForContractStatus() {
    // return this.dialog
    //   .open(ConfirmationDialogComponent, {
    //     panelClass: 'full-width-dialog',
    //     width: this.windowService.isMobile ? '100%' : '50%',
    //     data: {
    //       title: 'Are you sure?',
    //       html:
    //         '<b>Once a client has been marked as prepared for contract, any non-standard spec changes will display in the Extras tab.</b>' +
    //         "<br />We'll also save a copy of the current Spec that you can Share or Review at a later date.",
    //     },
    //   })
    //   .afterClosed();
    return this.dialogService.open(ConfirmationDialogComponent, {
      data: {
        html:
          '<b>Once a client has been marked as prepared for contract, any non-standard spec changes will display in the Extras tab.</b>' +
          "<br />We'll also save a copy of the current Spec that you can Share or Review at a later date.",
      },
      dialogTitle: 'Are you sure?',
    });
  }
  /* status end */

  deleteField(uid, sectionName, field) {
    return this.activeSpecService.deleteSpecField(uid, sectionName, field, [this.http.delete(`/spec/${uid}/${sectionName}/${field}`)]);
  }

  highlightField(uid, sectionName, field) {
    const currentSpec = this.getActiveSpec();
    const updateChanges = this.specFormatterService.getHighlightFieldChanges(currentSpec, sectionName, field);
    return this.activeSpecService.updateSpec(uid, updateChanges);
  }

  updateQuote(specId, changes) {
    const updateQuoteChanges = this.specFormatterService.getUpdateQuoteChanges(changes);
    return this.activeSpecService.updateSpec(specId, updateQuoteChanges);
  }

  /* custom values - non-standard options */

  public updateCustomOption(currentSpec, section, field, customValue) {
    const allChanges = this.specFormatterService.getUpdateSpecChanges(currentSpec, section, field, customValue);
    // To add custom_value timely before costom_values of other fields updating
    currentSpec.custom_value = mergeDeepLeft(allChanges.custom_value, currentSpec.custom_value || {});
    return this.activeSpecService.updateSpec(currentSpec.uid, allChanges);
  }

  public getCustomOptions() {
    const sections = sectionConfig;
    const spec = this.getActiveSpec();
    const customValues = spec?.custom_value;
    if (!customValues) {
      return [];
    }
    const customOptions = [];
    keys(customValues).forEach((sectionKey) => {
      keys(customValues[sectionKey]).forEach((fieldKey) => {
        const customValue = customValues[sectionKey][fieldKey];
        if (customValue.dismissed) {
          return;
        }
        const sectionConfig = sections.find((s) => sectionKey.includes(s.name));
        if (!sectionConfig) {
          const errMessage = `invalid senctions "${sectionKey}" in custom_value for ${spec?.uid}`;
          serviceLogger(errMessage);
          this.sentryService.logError(new Error(errMessage));
          return;
        }
        const fieldConfig = this.getFieldConfig(sectionKey, sectionConfig.fields, fieldKey);
        customOptions.push({
          dismissed: false,
          sectionName: sectionConfig.title,
          sectionKey,
          fieldName: fieldConfig.display,
          fieldKey,
          value: customValue.value,
        });
      });
    });
    return customOptions;
  }

  private getFieldConfig(sectionKey: String, fields, fieldKey: String) {
    //Consider some sectionKey with values '***-additional^x',such as 'flooring','blind' and 'cladding'
    if (sectionKey.includes('additional')) {
      const sectionName = sectionKey.split('^')[0];
      return fields.find((f) => f.name === sectionName).blockFields.find((f) => f.name === fieldKey);
    } else {
      return fields.find((f) => f.name === fieldKey);
    }
  }

  /* custom values - non-standard options end */

  /**
   * The content of a hidden section is no longer shown in the spec or the print outs.
   * Any extras associated with the section are removed. The section can be shown again if required.
   * @param uid
   * @param sectionName
   */
  public hideSection(uid: string, sectionName: string) {
    const currentSpec = this.getActiveSpec();
    const changes = this.specFormatterService.getHideSectionChanges(currentSpec, sectionName);
    return this.activeSpecService.updateSpec(uid, changes);
  }

  public hideSubSection(uid, sectionName, subSectionName) {
    if (!subSectionName) {
      console.warn(`missing a subsection name in ${sectionName}. Not hiding subsection`);
      return;
    }
    const currentSpec = this.getActiveSpec();
    const changes = this.specFormatterService.getHideSubSectionChanges(currentSpec, sectionName, subSectionName);
    return this.activeSpecService.updateSpec(uid, changes);
  }

  public showSection(uid, sectionName: string) {
    const changes = this.specFormatterService.getShowSectionChanges(sectionName);
    return this.activeSpecService.updateSpec(uid, changes);
  }

  public showSubSection(uid, sectionName, subSectionName) {
    const changes = this.specFormatterService.getShowSubSectionChanges(sectionName, subSectionName);
    return this.activeSpecService.updateSpec(uid, changes);
  }

  public getCopyOfCurrentSpec() {
    return JSON.parse(JSON.stringify(this.getActiveSpec()));
  }

  /**
   * Add a new user specified section to the spec
   * These sections are stored separately in node custom_sections
   */
  public addNewSection(uid, sectionName, data, orderList) {
    const changes = this.specFormatterService.getAddNewSectionChanges(sectionName, data, orderList);
    return this.activeSpecService.updateSpec(uid, changes);
  }

  public updateSection(uid, sectionName, data) {
    const changes = this.specFormatterService.getUpdateSectionChanges(sectionName, data);
    return this.activeSpecService.updateSpec(uid, changes);
  }

  public updateSpecOrder(uid: string, orderList: string[], updatedSpec?) {
    if (updatedSpec) {
      // TODO - move into update below?
      this.activeSpecService.updateActiveSpec(updatedSpec);
    }
    const changes = this.specFormatterService.getUpdateSpecOrderChanges(orderList);
    return this.activeSpecService.updateSpec(uid, changes);
  }

  public deleteCustomSection(uid, sectionName) {
    const currentSpec = this.getCopyOfCurrentSpec();
    const requests = [this.http.delete(`/spec/${uid}/${sectionName}`), this.http.delete(`/spec/${uid}/custom_sections/${sectionName}`)];
    if (currentSpec['sort']) {
      const orderList = currentSpec['sort']['orderList'].filter((el) => el !== sectionName);
      requests.push(this.http.patch(`/spec/${uid}/sort`, { orderList }));
    }
    return this.activeSpecService.deleteCustomSection(uid, sectionName, requests);
  }

  /** Add user defined sections to the predfined sections */
  public addSectionsFromSpec(spec, sections): any[] {
    return this.specFormatterService.combineUserAndDefinedSections(spec, sections);
  }

  // Updates the section name displayed to the user
  public updateSectionName(uid, sectionName, name) {
    const changes = this.specFormatterService.getUpdateSectionNameChanges(sectionName, name);
    return this.activeSpecService.updateSpec(uid, changes);
  }

  // Updates the sub section name displayed to the user
  public updateSubSectionName(uid, sectionName, field, name) {
    const changes = this.specFormatterService.getUpdateSubSectionNameChanges(sectionName, field.replace(/\//g, '\\'), name);
    return this.activeSpecService.updateSpec(uid, changes);
  }

  private openDisableSnackBar(disabled: boolean) {
    const action = disabled ? 'disabled' : 'enabled';
    this.snackBar
      .open(`Edit mode ${action}`, 'Cancel', { duration: 5000 })
      .onAction()
      .subscribe(() => {
        this.editSpecMode();
      });
  }

  private getSectionName(section) {
    let sectionName;
    if (section.name) {
      sectionName = section.name;
    } else {
      sectionName = section;
    }
    return sectionName;
  }

  private configureCustomFields(spec) {
    if (!spec['custom_fields']) {
      return {};
    } else {
      return this.specUtilityService.addSlash(spec);
    }
  }
}
