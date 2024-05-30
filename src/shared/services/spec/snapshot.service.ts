import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SpecUtilityService } from './spec.utility.service';

@Injectable({
  providedIn: 'root',
})
export class SnapshotService {
  private refreshRequired: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public readonly refreshRequired$: Observable<boolean> = this.refreshRequired.asObservable();

  constructor(private http: HttpClient, private specUtilityService: SpecUtilityService) {}

  signalRefresh() {
    this.refreshRequired.next(true);
  }

  getSnapshot(specUid, snapUid) {
    // will return a snapshot containing spec and quote
    return this.http.get(`/snapshots/${specUid}/${snapUid}`);
  }

  restoreSnapshot(specUid, snapUid) {
    // get the snap by uid
    return this.http.get(`/snapshots/${specUid}/${snapUid}`).pipe(
      flatMap((snap: any) => {
        // replace current spec and quote with snapshot versions
        const updates = [];
        updates.push(this.http.patch(`/spec/${specUid}`, snap.spec));
        //update client table
        const spec = snap.spec;
        const restoredClient = {
          client: spec.contact_details.client,
          consultantName: spec.contact_details.consultantName,
          dateModified: spec.details.lastModified,
          lastModified: spec.details.lastModified,
          lot: spec.section_details.lot,
          postContract: spec.details.postContract,
          projectManagerName: spec.contact_details.projectManagerName,
          scheme: spec.section_details.scheme,
          status: spec.details.status,
          synced: spec.details.synced,
        };
        updates.push(this.http.patch(`/clients/${specUid}`, restoredClient));
        return forkJoin(updates);
      })
    );
  }

  getSnapshots(uid) {
    return this.http.get(`/snapshots/${uid}`).pipe(
      map((data) => {
        if (!data) {
          return [];
        }
        const snapshots = [];
        Object.keys(data).forEach((snapshotKey) => {
          const snap = data[snapshotKey];
          snapshots.push({
            uid: snapshotKey,
            description: snap.description,
            created: snap.created,
            createdBy: snap.createdBy,
          });
        });
        return snapshots;
      })
    );
  }

  signSnapshot(specUid, snapUid, snapshot, description) {
    // the intention is that this is used from the public page, for which users have restricted write access
    // I.e. the can only write to certain fields, hence we update those fields only
    const updates = [
      this.http.patch(`/snapshots/${specUid}/${snapUid}`, { description: description }),
      this.http.patch(`/snapshots/${specUid}/${snapUid}/spec/signatures`, { spec: snapshot.spec.signatures.spec }),
    ];

    updates.push(this.http.patch(`/snapshots/${specUid}/${snapUid}/spec/signatures`, snapshot.spec.signatures));

    return forkJoin(updates);
  }

  saveSnapshot(uid, snapshot) {
    if (snapshot.spec && snapshot.spec.custom_fields) {
      snapshot.spec.custom_fields = this.specUtilityService.removeSlash(snapshot.spec);
    }
    return this.http.post(`/snapshots/${uid}`, snapshot);
  }
  updateSnapshot(uid, snapId, snapshot) {
    return this.http.patch(`/snapshots/${uid}/${snapId}`, snapshot);
  }

  deleteSnapshot(uid, snapId) {
    return this.http.delete(`/snapshots/${uid}/${snapId}`);
  }
}
