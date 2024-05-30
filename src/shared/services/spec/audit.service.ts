import { BehaviorSubject, forkJoin } from 'rxjs';
import { clone, keys, lensPath, path, set, view } from 'ramda';

import { AuthService } from '@auth/services/auth.service';
import { AuthUser } from '@auth/types';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getValue } from '../../logic/getFieldValue';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuditService {
  private auditList$: BehaviorSubject<any>;

  constructor(private http: HttpClient, private authService: AuthService) {
    this.auditList$ = new BehaviorSubject<any>(null);
  }

  getAuditChange(uid, sectionName, changes, fieldType) {
    const user = this.getUser();
    const fieldName = Object.keys(changes)[0];
    const change = { value: getValue(changes[fieldName], fieldType), user, date: Date.now() };
    const auditList = this.auditList$.getValue();

    const auditSectionName = getSectionName(sectionName);
    const groupName = getGroupName(sectionName);

    const nextChangesId = getNextChangeId(auditList, auditSectionName, groupName, fieldName);

    if (nextChangesId === undefined) {
      // ! this should never happen
      console.warn(`audit not saved as nextChangeId invalid !!!`);
      console.log(JSON.stringify(auditList));
      return;
    }

    if (groupName) {
      return {
        [uid]: {
          [auditSectionName]: {
            [groupName]: {
              [fieldName]: { [nextChangesId]: change },
            },
          },
        },
      };
    }

    return {
      [uid]: {
        [auditSectionName]: {
          [fieldName]: { [nextChangesId]: change },
        },
      },
    };
  }

  addChangesToAuditNew(uid, sectionName, changes, fieldType) {
    const user = this.getUser();

    let fieldName, change;
    if (sectionName.indexOf('^') >= 0) {
      const blockIndex = sectionName.split('^')[1];
      fieldName = Object.keys(changes[getSectionName(sectionName)][blockIndex])[0];
      change = { value: getValue(changes[getSectionName(sectionName)][blockIndex][fieldName], fieldType), user, date: Date.now() };
    } else {
      fieldName = Object.keys(changes[getSectionName(sectionName)])[0];
      change = { value: getValue(changes[getSectionName(sectionName)][fieldName], fieldType), user, date: Date.now() };
    }

    const auditList = this.auditList$.getValue();

    const auditSectionName = getSectionName(sectionName);
    const groupName = getGroupName(sectionName);

    const nextChangesId = getNextChangeId(auditList, auditSectionName, groupName, fieldName);

    if (nextChangesId === undefined) {
      // ! this should never happen
      console.warn(`audit not saved as nextChangeId invalid !!!`);
      console.log(JSON.stringify(auditList));
      return;
    }

    const path = groupName
      ? `/audit/${uid}/${auditSectionName}/${groupName}/${fieldName}`
      : `/audit/${uid}/${auditSectionName}/${fieldName}`;
    return this.http
      .patch(path, { [nextChangesId]: change })
      .pipe(tap(() => this.addToLocalAudit(auditSectionName, fieldName, change, groupName)));
  }

  addChangesToAudit(uid, sectionName, changes, fieldType) {
    const user = this.getUser();
    const fieldName = Object.keys(changes)[0];
    const change = { value: getValue(changes[fieldName], fieldType), user, date: Date.now() };
    const auditList = this.auditList$.getValue();

    const auditSectionName = getSectionName(sectionName);
    const groupName = getGroupName(sectionName);

    const nextChangesId = getNextChangeId(auditList, auditSectionName, groupName, fieldName);

    if (nextChangesId === undefined) {
      // ! this should never happen
      console.warn(`audit not saved as nextChangeId invalid !!!`);
      console.log(JSON.stringify(auditList));
      return;
    }

    const path = groupName
      ? `/audit/${uid}/${auditSectionName}/${groupName}/${fieldName}`
      : `/audit/${uid}/${auditSectionName}/${fieldName}`;

    return this.http
      .patch(path, { [nextChangesId]: change })
      .pipe(tap(() => this.addToLocalAudit(auditSectionName, fieldName, change, groupName)));
  }

  addCustomBlock(uid, sectionName, index, block) {
    const groupName = `${sectionName}-${index}`;
    const fieldName = Object.keys(block)[0];
    const change = {
      date: Date.now(),
      user: this.getUser(),
      value: block[fieldName],
    };
    const requests = [this.http.patch(`/audit/${uid}/${sectionName}/${groupName}/${fieldName}`, { [0]: change })];

    return forkJoin(requests)
      .pipe(tap(() => this.addToLocalAudit(sectionName, fieldName, change, groupName)))
      .subscribe(() => true);
  }

  removeCustomBlock(uid, sectionName, index) {
    const groupName = `${sectionName}-${index}`;
    const currentList = this.auditList$.getValue();
    const updatedSection = removeBlockAndUpdateOrder(currentList, sectionName, groupName);

    // TODO? ensure we don't leave an empty list when removing last block?

    const requests = [this.http.put(`/audit/${uid}/${sectionName}`, updatedSection[sectionName])];

    return forkJoin(requests)
      .pipe(tap(() => this.removeFromLocalAudit(sectionName, groupName)))
      .subscribe(() => true);
  }

  getSpecAudit(uid) {
    return this.http.get(`/audit/${uid}`).pipe(
      tap((audit) => {
        this.auditList$.next(audit);
      })
    );
  }

  getAudit() {
    return this.auditList$.getValue();
  }

  createInitialAudit(clientDetails, uid) {
    const user = this.getUser();
    const initialAudit = getInitialAudit(clientDetails, Date.now(), user);

    return this.http.patch(`/audit/${uid}`, initialAudit).pipe(tap(() => this.auditList$.next(initialAudit)));
  }

  private getUser() {
    const userInfo = this.authService.authUser as AuthUser;
    return userInfo ? userInfo.email : `Unknown User ${userInfo.uid}`;
  }

  private addToLocalAudit(sectionName, fieldName, change, groupName) {
    const currentList = this.auditList$.getValue();

    this.auditList$.next(getAuditList(currentList, sectionName, fieldName, change, groupName));
  }

  private removeFromLocalAudit(sectionName, groupName) {
    const currentList = clone(this.auditList$.getValue());
    delete currentList[sectionName][groupName];
    this.auditList$.next(currentList);
  }
}

export function getAuditList(currentList, sectionName, fieldName, change, groupName) {
  // * If there is already a value, for this block field, add to the array
  if (path([sectionName, groupName, fieldName], currentList)) {
    const fieldLens = lensPath([sectionName, groupName, fieldName]);
    return set(fieldLens, [...view(fieldLens, currentList), change], currentList);
  }

  // * If there is already a value for this field, add to the array
  if (path([sectionName, fieldName], currentList)) {
    const fieldLens = lensPath([sectionName, fieldName]);
    return set(fieldLens, [...view(fieldLens, currentList), change], currentList);
  }

  // * If the block exists, but this field does not, add it and create an array of changes with first change
  if (path([sectionName], currentList) && groupName) {
    const setLens = lensPath([sectionName, groupName]);
    return set(
      setLens,
      {
        ...view(setLens, currentList),
        [fieldName]: [change],
      },
      currentList
    );
  }

  // * If there are no values yet for this block field, create an array of changes with first change
  if (currentList && currentList[sectionName] && groupName) {
    const setLens = lensPath([sectionName]);
    const readLens = lensPath([sectionName, groupName, fieldName]);
    return set(setLens, [...view(readLens, currentList), [change]], currentList);
  }

  // * If there are no values yet for this field, create an array of changes with first change
  if (currentList && currentList[sectionName]) {
    const setLens = lensPath([sectionName, fieldName]);
    return set(setLens, [change], currentList);
  }

  // * if the section has no audit yet, add it and create an array of changes with first change
  if (currentList) {
    if (groupName) {
      return {
        ...currentList,
        [sectionName]: { [groupName]: { [fieldName]: [change] } },
      };
    } else {
      return {
        ...currentList,
        [sectionName]: { [fieldName]: [change] },
      };
    }
  }

  // * handle no current audit existing at all - this will be the case for clients created before this feature was introduced
  if (groupName) {
    return { [sectionName]: { [groupName]: { [fieldName]: [change] } } };
  } else {
    return { [sectionName]: { [fieldName]: [change] } };
  }
}

export const getInitialAudit = (clientDetails, date, user) => {
  const getFieldAudit = (value) => {
    return {
      date,
      user,
      value,
    };
  };
  return {
    'cladding-additional': {
      'cladding-additional-0': {
        claddingType: [getFieldAudit('Brick')],
      },
    },
    details: {
      client: [getFieldAudit(clientDetails.client)],
      status: [getFieldAudit('Quote')],
      subdivision: [getFieldAudit(clientDetails.subdivision)],
    },
    'flooring-additional': {
      'flooring-additional-0': {
        floorTypes: [getFieldAudit('Carpet')],
      },
    },
    section_details: {
      lot: [getFieldAudit(clientDetails.lot)],
    },
    quote: {
      paymentMethod: [getFieldAudit('Turnkey Payment method')],
    },
  };
};

// * HELPERS: Defined here outside service so easy to test

export function getGroupName(sectionName) {
  if (sectionName.indexOf('^') >= 0) {
    return sectionName.replace('^', '-');
  }
  return '';
}

export function getSectionName(sectionName) {
  if (sectionName.indexOf('^') >= 0) {
    return sectionName.split('^')[0];
  }
  return sectionName;
}

export function getNextChangeId(auditList, sectionName, groupName, fieldName) {
  return path([sectionName, groupName, fieldName], auditList)
    ? path([sectionName, groupName, fieldName], auditList).length
    : path([sectionName, fieldName], auditList)
    ? path([sectionName, fieldName], auditList).length
    : 0;
}

export function removeBlockAndUpdateOrder(auditList, sectionName, groupName) {
  const currentList = clone(auditList);

  // delete the block requested
  delete currentList[sectionName][groupName];

  // reorder blocks so list starts with 0 and following blocks are numbered sequentially
  const updated = { [sectionName]: {} };
  const blockKeys = keys(currentList[sectionName]);
  blockKeys.forEach((key, idx) => {
    const newKey = `${sectionName}-${idx}`;
    updated[sectionName][newKey] = currentList[sectionName][key];
  });

  return updated;
}
