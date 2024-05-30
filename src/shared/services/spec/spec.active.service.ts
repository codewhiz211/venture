import { BehaviorSubject, Observable } from 'rxjs';
import { isEmpty, keys, mergeDeepRight, pick } from 'ramda';

import { ClientSpec } from '../../interfaces/client-spec.interface';
import { Injectable } from '@angular/core';
import { SpecDBService } from './spec.db.service';
import { tap } from 'rxjs/operators';

/**
 * Maintains a local copy of the spec that is currently active in the application
 * Any part of the application that needs the spec should access it from here (once loaded).
 * Maintains open/closed state of spec sections / tabs etc
 */
@Injectable({
  providedIn: 'root',
})
export class SpecActiveService {
  private activeSpec: BehaviorSubject<ClientSpec> = new BehaviorSubject(undefined);
  public readonly activeSpec$: Observable<ClientSpec> = this.activeSpec.asObservable();

  private activeSection: BehaviorSubject<number> = new BehaviorSubject(null);
  public activeSection$: Observable<number>;

  private activeSectionAction: BehaviorSubject<number> = new BehaviorSubject(null);
  public activeSectionAction$: Observable<number>;

  private selectedTab: BehaviorSubject<number> = new BehaviorSubject(0);
  public readonly selectedTab$: Observable<number> = this.selectedTab.asObservable();

  private _extrasNeedSharing: BehaviorSubject<boolean> = new BehaviorSubject(false);

  get extrasNeedSharing() {
    return this._extrasNeedSharing.value;
  }

  constructor(private specDBService: SpecDBService) {
    this.activeSection$ = this.activeSection.asObservable();
    this.activeSectionAction$ = this.activeSectionAction.asObservable();
  }

  public closeSection() {
    this.activeSection.next(null);
  }

  public closeSectionAction() {
    this.activeSectionAction.next(null);
  }

  public getActiveSpec(): ClientSpec {
    return this.activeSpec.getValue();
  }

  /**
   * Replace existing spec with the one supplied
   * @param spec
   */
  public initialiseActiveSpec(spec) {
    // TODO remove or make local only
    this.activeSpec.next(spec);
  }

  public openSection(sectionId: number) {
    if (sectionId !== this.activeSection.getValue()) {
      this.activeSection.next(sectionId);
    }
  }

  public openSectionAction(actionId: number) {
    this.activeSectionAction.next(actionId);
  }

  public updateActiveSpec(spec) {
    // todo update this to apply changes to current spec and output
    this.activeSpec.next(spec);
  }

  public updateSelectedTab(tabIndex) {
    this.selectedTab.next(tabIndex);
  }

  // TODO this will replace updateActiveSpec when all uses of updateActiveSpec are updated
  public updateSpec(specUid, specChanges, clientChanges = {}) {
    return this.specDBService.saveChangesToDB(specUid, specChanges, clientChanges).pipe(
      tap(() => {
        this.updateLocalSpec(specChanges);
      })
    );
  }

  public deleteSpecField(uid, sectionName, fieldName, requests) {
    const currentSpec = this.getActiveSpec();

    delete currentSpec[sectionName][fieldName];

    return this.specDBService.saveRequestsToDB(uid, requests).pipe(
      tap(() => {
        // we are using the updated currentSpec, rather than an object with just the changes, because updateLocalSpec uses
        // deepMerge and missing fields in a changeObject would be replaced with existing fields from spec!!
        // E.g. they would not be deleted
        this.updateLocalSpec(currentSpec);
      })
    );
  }

  public deleteCustomSection(uid, sectionName, requests) {
    const currentSpec = this.getActiveSpec();

    // delete from the local spec, requests will delete from the server
    const customSections = currentSpec['custom_sections'];
    delete customSections[sectionName];
    delete currentSpec[sectionName];
    currentSpec['custom_sections'] = customSections;
    if (currentSpec['sort']) {
      const orderList = currentSpec['sort']['orderList'].filter((el) => el !== sectionName);
      currentSpec['sort']['orderList'] = orderList;
    }

    return this.specDBService.saveRequestsToDB(uid, requests).pipe(
      tap(() => {
        // we are using the updated currentSpec, rather than an object with just the changes, because updateLocalSpec uses
        // deepMerge and missing fields in a changeObject would be replaced with existing fields from spec!!
        // E.g. they would not be deleted
        this.updateLocalSpec(currentSpec);
      })
    );
  }

  /**
   * In most cases we want to PATCH the DB, however in some cases (removing custom blocks) we want to PUT a new array
   * But specChanges might also contain some changes we do want to PATCH, so use an 'writes' object to specify which
   * changes are PUTs.
   * @param specUid
   * @param specChanges
   * @param clientChanges
   * @param writes - any sectionName present with value of true should use PUT instead of PATCH.
   */
  public writeSpec(specUid, specChanges, clientChanges = {}, writes) {
    if (isEmpty(writes)) {
      throw 'Must supply keys for write';
    }
    return this.specDBService.saveChangesToDB(specUid, specChanges, clientChanges, writes).pipe(
      tap(() => {
        this.updateLocalSpec(specChanges);
      })
    );
  }

  public markExtraAsShared() {
    this._extrasNeedSharing.next(false);
  }

  private updateLocalSpec(specChanges) {
    const currentSpec = this.getActiveSpec();
    const allChanges = this.addAnyCustomBlockChanges(currentSpec, specChanges);
    const updatedSpec = mergeDeepRight(currentSpec, allChanges);
    if (keys(allChanges.extras).length > 0 || keys(allChanges.extras_manual).length > 0) {
      // ideally this would be reactive, E.g. we map activeSpec$ but that's not straightforward without knowing the delta
      this._extrasNeedSharing.next(true);
    }
    this.updateActiveSpec(updatedSpec);
  }

  private addAnyCustomBlockChanges(currentSpec, specChanges) {
    const sectionKey = keys(specChanges)[0];
    const blockIndex = keys(specChanges[sectionKey])[0];
    if (blockIndex && !isNaN(blockIndex)) {
      const updatedBlocks = currentSpec[sectionKey] || [];
      updatedBlocks[blockIndex] = specChanges[sectionKey][blockIndex];
      return {
        ...specChanges,
        [sectionKey]: updatedBlocks,
      };
    }
    return specChanges;
  }
}
