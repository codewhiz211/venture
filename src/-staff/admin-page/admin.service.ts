import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG } from 'app.config';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { UserSummary } from 'src/-venture/+admin/services/user-summary.interface';

import { UserType } from '@auth/roles';
import { includes } from 'ramda';
import { adminLogger } from './admin.logger';
import { User } from '@interfaces/user.interface';
import { BaseDbService } from '@services/base.db.service';
import { SubbieSummary } from 'src/-venture/+admin/services/subbie-summary.interface';

@Injectable({
  providedIn: 'root',
})
//AdminService on new shell
export class AdminService extends BaseDbService {
  private _staffs: Subject<UserSummary[]> = new ReplaySubject(undefined);
  public readonly staffs$: Observable<UserSummary[]> = this._staffs.asObservable();
  public _subbie: Subject<SubbieSummary[]> = new ReplaySubject(undefined);
  public readonly subbie$: Observable<SubbieSummary[]> = this._subbie.asObservable();

  private config;
  constructor(private http: HttpClient, @Inject(APP_CONFIG) config) {
    super();
    this.config = config;
  }

  deleteClient(uid) {
    const endpoint = `https://us-central1-${this.config.projectId}.cloudfunctions.net/admin/deleteClient`;
    return this.http.post(endpoint, { uid });
  }

  getStaff() {
    this.http.get('/users').subscribe((data) => {
      const users: UserSummary[] = this.addKeys(data)
        .filter((user) => user.role === UserType.Staff)
        .map((user) => {
          return {
            uid: user.uid,
            email: user.email,
            name: user.name,
            role: user.role,
            permissions: user.permissions.filter((p) => !includes(p, ['developer'])) || [],
          };
        });
      this._staffs.next(users);
    });
  }

  addStaff(user: User) {
    const endpoint = `https://us-central1-${this.config.projectId}.cloudfunctions.net/admin/createUser`;
    return this.http.post(endpoint, user);
  }

  editStaff(uid, userInfo) {
    return this.http.post('/functions/admin/updateUser', { uid, ...userInfo });
  }

  addPermissions(uid: string, permissions: string[]) {
    adminLogger(`addPermissions(${uid})`);
    const endpoint = `https://us-central1-${this.config.projectId}.cloudfunctions.net/admin/addPermissions`;

    return this.http.post(endpoint, { uid, permissions });
  }

  removePermissions(uid: string, permissions: string[]) {
    adminLogger(`removePermissions(${uid})`);
    const endpoint = `https://us-central1-${this.config.projectId}.cloudfunctions.net/admin/removePermissions`;

    return this.http.post(endpoint, { uid, permissions });
  }

  deleteStaff(uid) {
    const endpoint = `https://us-central1-${this.config.projectId}.cloudfunctions.net/admin/deleteUser`;
    return this.http.post(endpoint, { uid });
  }

  getAllSubbies() {
    const endpoint = `/functions/app/subbies?withUsers=true`;
    this.http.get(endpoint).subscribe((data) => {
      this._subbie.next(this.addKeys(data));
    });
  }

  createSubbie(subbie: any) {
    const endpoint = `/functions/admin/createSubbie`;
    return this.http.post(endpoint, { name: subbie.name, users: subbie.users });
  }

  editSubbie(subbie: any, subbieUid: string, changedUsers: any[]) {
    const endpoint = `/functions/admin/editSubbie`;
    return this.http.post(endpoint, { uid: subbieUid, name: subbie.name, users: changedUsers });
  }

  deleteSubbie(subbieUid: string) {
    const endpoint = `/functions/admin/deleteSubbie`;
    return this.http.post(endpoint, { uid: subbieUid });
  }
}
