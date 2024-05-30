import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { APP_CONFIG } from 'app.config';
import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { SubbieSummary } from './subbie-summary.interface';
import { User } from '../../../shared/interfaces/user.interface';
import { UserSummary } from './user-summary.interface';
import { adminLogger } from '../admin.logger';

@Injectable()
export class AdminService {
  private config;

  constructor(private http: HttpClient, @Inject(APP_CONFIG) config) {
    this.config = config;
  }

  addUser(user: User) {
    const endpoint = `https://us-central1-${this.config.projectId}.cloudfunctions.net/admin/createUser`;
    return this.http.post(endpoint, user);
  }

  editUser(name: string, addedPermissions: string[], deletedPermissions: string[], userUid: string) {
    return this.http.patch(`/users/${userUid}`, { name }).pipe(
      switchMap((user) => {
        adminLogger('updateUser', user);
        if (addedPermissions?.length > 0) {
          return this.addPermissions(userUid, addedPermissions);
        } else {
          return of(0);
        }
      }),
      switchMap((result) => {
        adminLogger('addingResult', result);
        if (deletedPermissions?.length > 0) {
          return this.removePermissions(userUid, deletedPermissions);
        } else {
          return of(0);
        }
      })
    );
  }

  getUsers(): Observable<UserSummary[]> {
    return this.http.get('/users').pipe(
      map((data) => {
        const users: UserSummary[] = [];
        Object.keys(data).forEach((userKey) => {
          const user: UserSummary = {
            uid: userKey,
            email: data[userKey].email,
            name: data[userKey].name,
            role: data[userKey].role,
            permissions: data[userKey].permissions,
          };
          users.push(user);
        });
        return users;
      })
    );
  }

  deleteUser(uid) {
    const endpoint = `https://us-central1-${this.config.projectId}.cloudfunctions.net/admin/deleteUser`;
    return this.http.post(endpoint, { uid });
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

  private getSubUserForDB(results, users, userUids: string[]) {
    const userInfo = {};
    results.forEach((result) => {
      if (!result) {
        return;
      }
      userInfo[result.email] = result.uid;
      userUids.push(result.uid);
    });
    return users.map((user) => {
      return { ...user, ...{ uid: userInfo[user.email] || user.uid } };
    });
  }

  getAllSubbies(): Observable<SubbieSummary[]> {
    const endpoint = `/functions/app/subbies?withUsers=true`;
    return this.http.get(endpoint) as Observable<SubbieSummary[]>;
  }

  deleteClient(uid) {
    const endpoint = `https://us-central1-${this.config.projectId}.cloudfunctions.net/admin/deleteClient`;
    return this.http.post(endpoint, { uid });
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

  // TODO consider an updatePermissions EP that can update multiple permissions at once (currently we only have one)

  makeUserStaff(uid) {
    return this.http.post(`https://us-central1-${this.config.projectId}.cloudfunctions.net/admin/addRole`, {
      uid,
      role: 'staff',
      devToken: 'ROTOROA',
    });
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body: any = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return throwError(errMsg);
  }
}
