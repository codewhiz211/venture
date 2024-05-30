import { keys, mergeDeepLeft } from 'ramda';

import { ClientSpec } from '../../interfaces/client-spec.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { serviceLogger } from '../serviceLogger';

/**
 * This service should read/persist changes to the DB and NOTHING else.
 */
@Injectable({
  providedIn: 'root',
})
export class SpecDBService {
  constructor(private http: HttpClient) {}

  public getClientSpec(uid) {
    return this.http.get<ClientSpec>(`/spec/${uid}`);
  }

  /**
   * Persists the supplied changes to the specified spec.
   * Ensures that last modified dates are set correctly.
   * @param specUid
   * @param specChanges
   * @param clientChanges
   * @param write - perform a PUT instead of a PATCH for specified sections
   */
  public saveChangesToDB(specUid: string, specChanges: any, clientChanges: any = {}, write = {}) {
    const modifiedDate = Date.now();
    const clientChangesWithDateModified = mergeDeepLeft(
      {
        lastModified: modifiedDate,
      },
      clientChanges
    );

    const updates = [
      this.http.patch(`/spec/${specUid}/details`, {
        lastModified: modifiedDate,
      }),
      this.http.patch(`/clients/${specUid}`, clientChangesWithDateModified),
    ];

    // to avoid the need to include the existing spec in the update, we don't save the updates as one change,
    // instead we update each section individually - meaning the payload only needs to be the differences

    // [NOTE1] But we still need to do this for nested objects (see custom_value) we
    //         could try to be smarter about how we determine sectionsToUpdate...
    const sectionsToUpdate = keys(specChanges);
    sectionsToUpdate.forEach((sectionKey) => {
      serviceLogger(`update section ${sectionKey} with`);
      serviceLogger(specChanges[sectionKey]);

      if (write[sectionKey]) {
        updates.push(this.getSectionWriteRequest(specUid, sectionKey, specChanges[sectionKey]));
      } else {
        updates.push(this.getSectionPatchRequest(specUid, sectionKey, specChanges[sectionKey]));
      }
    });

    return forkJoin(updates);
  }

  /**
   * Use this method to perform multiple DB updates; ensures that last modified also gets set
   * @param specUid
   * @param requests
   */
  public saveRequestsToDB(specUid: string, requests: any[]) {
    const modifiedDate = Date.now();

    requests.unshift(this.http.patch(`/clients/${specUid}`, { lastModified: modifiedDate }));

    requests.unshift(
      this.http.patch(`/spec/${specUid}`, {
        details: { lastModified: modifiedDate },
      })
    );

    return forkJoin(requests);
  }

  /**
   * Create an update request
   * Updates for custom fields will be in format { sectionName: { blockIndex: {}}}
   */
  private getSectionPatchRequest(specUid, sectionKey, sectionChanges) {
    const changeKeys = keys(sectionChanges);
    if (changeKeys.length === 1 && !isNaN(changeKeys[0])) {
      const blockIndex = changeKeys[0];
      return this.http.patch(`/spec/${specUid}/${sectionKey}/${blockIndex}`, sectionChanges[blockIndex]);
    } else {
      return this.http.patch(`/spec/${specUid}/${sectionKey}`, sectionChanges);
    }
  }

  private getSectionWriteRequest(specUid, sectionKey, sectionChanges) {
    // assume that write requests are not needed for blocks - we'll either patch them, or update the root
    return this.http.put(`/spec/${specUid}/${sectionKey}`, sectionChanges);
  }
}
