import 'firebase/auth';

import * as firebase from 'firebase/app';

import { AnonymousUser, AuthUser } from '../types';
import { BehaviorSubject, Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { LocalStorageService } from '@services/local-storage.service';
import { Router } from '@angular/router';
import { UserType } from '../roles';
import { contains } from 'ramda';
import createLogger from 'debug';
import { APP_CONFIG } from 'app.config';
import { tap } from 'rxjs/operators';

interface DBUser {
  defaultPassword: boolean;
  email: string;
  isOnboard: boolean;
  name: string;
  role: string;
  subbieUid?: string;
}

const logger = createLogger('ven:common:auth');

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private config;

  private _authToken: BehaviorSubject<string> = new BehaviorSubject(null);
  private isLocal: boolean = false;

  private _authUser: BehaviorSubject<AuthUser | AnonymousUser> = new BehaviorSubject(null);
  public readonly authUser$: Observable<AuthUser | AnonymousUser> = this._authUser.asObservable();
  //notice: Avoid to emit message from subscription of authUser$, as this（onAuthStateChanged） will get this message fail to trigger Angular change detection (this can be fixed by ChangeDetectorRef which we'd better to avoid.)

  constructor(@Inject(APP_CONFIG) config, private http: HttpClient, private router: Router, private storage: LocalStorageService) {
    this.config = config;

    this.authUser$.subscribe((authUser) => logger(authUser));

    firebase.auth().onAuthStateChanged((fbUserCredential) => this.handleAuthStateChange(fbUserCredential));
  }

  private async handleAuthStateChange(fbUserCredential) {
    if (!fbUserCredential) {
      logger('no fbUserCredential');
      return;
    }

    if (!firebase.auth().currentUser) {
      logger('no current fb user');
      this.logout();
      return;
    }

    const idTokenResult = await firebase.auth().currentUser.getIdTokenResult();

    if (!idTokenResult) {
      logger('no idTokenResult');
      this.logout();
      return;
    }

    const { claims, token: idToken } = idTokenResult;

    const { metadata } = fbUserCredential;

    this.emitAuthToken(idToken);

    if (!claims) {
      logger('no claims');
      this.logout();
      return;
    }

    // we should only store minimal info in the claims, store the rest in the DB
    let user: any;
    if (claims.provider_id != 'anonymous') {
      const dbUser: DBUser = await this.getDBUser(claims.user_id);
      user = {
        createdAtMs: metadata?.a,
        defaultPassword: dbUser.defaultPassword,
        lastSignonMs: metadata?.b,
        email: claims.email,
        name: claims.name,
        isAnonymous: false,
        permissions: claims.permissions,
        type: this.getTypeFromClaims(claims),
        uid: claims.user_id,
      };
      if (user.type === UserType.Subbie) {
        user.subbieUid = dbUser.subbieUid;
      }
    } else {
      user = {
        createdAtMs: metadata?.a,
        lastSignonMs: metadata?.b,
        uid: claims.user_id,
        isAnonymous: true,
      };
    }

    logger(user);

    this.storage.save('token', idToken);
    this.storage.save('user', user);

    this.emitAuthUser(user);
  }

  // TODO review
  public get authUser(): AuthUser {
    return this.getUser();
  }

  public get isAuthenticated(): boolean {
    const user = this.getUser();
    return user != null;
  }

  public get isAdmin(): boolean {
    const user = this.getUser();
    const permissions = user ? user.permissions : [];
    return user ? contains('admin', permissions || []) : false;
  }

  public get isClient(): boolean {
    const user = this.getUser();
    return user.type === UserType.Client;
  }

  public get isStaff(): boolean {
    const user = this.getUser();
    return user.type === UserType.Staff;
  }

  public get isSubbie(): boolean {
    const user = this.getUser();
    return user.type === UserType.Subbie;
  }

  public get homePage(): string {
    return this.getHomeRoute();
  }

  public changePassword(uid: string, pwd: string) {
    const endpoint = `https://us-central1-${this.config.projectId}.cloudfunctions.net/admin/changePassword`;

    return this.http.post(endpoint, { pwd, uid }).pipe(
      tap(() => {
        this.emitAuthUser({
          ...this.getUser(),
          defaultPassword: false,
        });
      })
    );
  }

  public async login(email, password) {
    return this.loginToFirebase(email, password);
  }

  /**
   * Logs the user into Firebase
   * If this is the Staff app, or LOCAL subbies / client app then this is all that is required
   * @param email
   * @param password
   */
  public async loginToFirebase(email: string, password: string) {
    logger('loginToFirebase()');

    return firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.SESSION)
      .then(() => {
        // Existing and future Auth states are now persisted in the current
        // session only. Closing the window would clear any existing state even
        // if a user forgets to sign out.
        // ...
        // New sign-in will be persisted with session persistence.
        return firebase.auth().signInWithEmailAndPassword(email, password);
      });
  }

  public async logout() {
    logger('logout()');

    this.storage.remove('token');
    this.storage.remove('user');

    this.emitAuthUser(null);
    this.emitAuthToken(null);

    await firebase.auth().signOut();

    this.router.navigate(['/venture/login']);
  }

  public getToken() {
    let token = this._authToken.getValue();
    if (!token) {
      // use value from storage so that pasting a link into a signed in tab works
      token = this.storage.get('token');
    }
    return token;
  }

  public updateToken(token) {
    this.storage.save('token', token);
    this._authToken.next(token);
  }

  public clearToken() {
    this.storage.remove('token');
    this._authToken.next(null);
  }

  public async signinAnon() {
    logger('signinAnon');

    await firebase.auth().signInAnonymously();

    logger('logged in as anonymous user');

    const idTokenResult = await firebase.auth().currentUser.getIdTokenResult();

    this.emitAuthToken(idTokenResult.token);

    this.emitAuthUser({
      type: UserType.Anonymous,
      isAnonymous: true,
    });
  }

  public requestPasswordReset(email: string) {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  public verifyResetPasswordCode(actionCode: string) {
    // Verify the password reset code is valid.
    return firebase.auth().verifyPasswordResetCode(actionCode);
  }

  public resetPassword(actionCode: string, newPassword: string) {
    return firebase
      .auth()
      .confirmPasswordReset(actionCode, newPassword)
      .then(function (resp) {
        // Password reset has been confirmed and new password updated.
        // TODO: Display a link back to the app, or sign-in the user directly
        // if the page belongs to the same domain as the app:
        // auth.signInWithEmailAndPassword(accountEmail, newPassword);
        // TODO: If a continue URL is available, display a button which on
        // click redirects the user back to the app via continueUrl with
        // additional state determined from that URL's parameters.
      })
      .catch(function (error) {
        // Error occurred during confirmation. The code might have expired or the
        // password is too weak.
      });
  }

  private getUser(): AuthUser {
    let user = this._authUser.getValue() as AuthUser;
    if (!user) {
      // use value from storage so that pasting a link into a signed in tab works
      user = this.storage.get('user');
    }
    return user;
  }

  private emitAuthUser(user) {
    this._authUser.next(user);
  }
  private emitAuthToken(token) {
    this._authToken.next(token);
  }

  private getDBUser(uid): Promise<DBUser> {
    return this.http.get(`/users/${uid}`).toPromise() as Promise<DBUser>;
  }

  private getTypeFromClaims(claims) {
    if (claims && claims.type) {
      switch (claims.type) {
        case 'subbie':
          return UserType.Subbie;

        case 'client':
          return UserType.Client;

        case 'staff':
          return UserType.Staff;
      }
    }
  }

  public getHomeRoute() {
    const authUser = this.getUser();
    if (authUser) {
      const type = authUser.type as UserType;
      switch (type) {
        case UserType.Staff:
          return '/staff/home';

        case UserType.Client:
          return '/clients/home';

        case UserType.Subbie:
          return '/subbies/home';

        default:
          console.error(`this user has an invalid type defined ${type}`);
          return '/venture/clients';
      }
    }
    return '/venture/login';
  }
}
