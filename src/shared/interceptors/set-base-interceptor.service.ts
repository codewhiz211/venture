import 'firebase/auth';

import * as firebase from 'firebase/app';

import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, filter, switchMap, take } from 'rxjs/operators';

import { AuthService } from '@auth/services/auth.service';

import { CustomHttpParams } from './custom-http.params';
import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import createLogger from 'debug';

import { from } from 'rxjs';
import { sharedLogger } from '@shared/shared.loger';
import { APP_CONFIG } from 'app.config';
import { databaseURL } from 'src/config/firebase.config';

const logger = createLogger('ven:common:interceptor');

@Injectable({
  providedIn: 'root',
})
export class SetBaseInterceptorService implements HttpInterceptor {
  private config;

  private refreshTokenInProgress = false;

  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(@Inject(APP_CONFIG) config, private authService: AuthService, private router: Router) {
    this.config = config;
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.indexOf('/functions/') !== -1) {
      return this.handleCloudFunctionsNew(next, request);
    } else if (
      request.url.indexOf('cloudfunctions') !== -1 ||
      (this.config.useLocalFunctions && request.url.indexOf('us-central1') !== -1)
    ) {
      return this.handleCloudFunctions(next, request);
    }

    return this.handleFirebaseDatabase(next, request);
  }

  handleAuthFunction(next, request) {
    logger('intercept: handling auth request');
    return next.handle(request);
  }

  handleCloudFunctionsNew(next, request) {
    logger('intercept: handling cloud function request (new)');
    const functionsUrl = request.url.replace('/functions/', `https://us-central1-${this.config.projectId}.cloudfunctions.net/`);

    const token = this.authService.getToken();
    if (request.method !== 'OPTIONS') {
      if (request.params instanceof CustomHttpParams && request.params.useFormData) {
        request = request.clone({
          url: functionsUrl,
          setHeaders: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        request = request.clone({
          url: functionsUrl,
          setHeaders: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      }
    }
    return next.handle(request);
  }

  handleCloudFunctions(next, request) {
    logger('intercept: handling cloud function request');

    const token = this.authService.getToken();
    if (request.method !== 'OPTIONS') {
      if (request.params instanceof CustomHttpParams && request.params.useFormData) {
        request = request.clone({
          setHeaders: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        request = request.clone({
          setHeaders: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      }
    }
    return next.handle(request);
  }

  handleFirebaseDatabase(next, request) {
    logger(`intercept: handling database request => ${request.url}`);
    // attempt call with current token
    const token = this.authService.getToken();
    if (!token) {
      logger('Token is missing !!!!!!!!!!!!!!!');
    }
    return next.handle(this.addAuthenticationToken(request, token)).pipe(
      catchError((error) => {
        // We don't want to refresh token for some requests like login or refresh token itself
        // So we verify url and we throw an error if it's the case
        if (request.url.includes('refreshtoken') || request.url.includes('login')) {
          // We do another check to see if refresh token failed
          // In this case we want to logout user and to redirect it to login page
          if (request.url.includes('refreshtoken')) {
            firebase.auth().signOut();
          }
          return throwError(error);
        }

        // If error status is different than 401 we want to skip refresh token
        // So we check that and throw the error if it's the case
        if (error.status !== 401) {
          return throwError(error);
        }

        // handle 401 errors
        if (this.refreshTokenInProgress) {
          // If refreshTokenInProgress is true, we will wait until refreshTokenSubject has a non-null value
          // – which means the new token is ready and we can retry the request again
          return this.refreshTokenSubject.pipe(
            filter((token) => token != null),
            take(1),
            switchMap((token) => {
              this.authService.updateToken(token);
              return next.handle(this.addAuthenticationToken(request, token));
            })
          );
        } else {
          logger('token expired, refreshing it');
          this.refreshTokenInProgress = true;

          // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
          this.refreshTokenSubject.next(null);

          // Cannot read property 'getIdToken' of null
          let subscription;
          if (firebase.auth().currentUser) {
            sharedLogger('currentUser');
            subscription = from(firebase.auth().currentUser.getIdToken());
            return this.renewToken(subscription, request, next, error);
          } else {
            // commonLogger('updating User');
            // debugger;
            // firebase.auth().onAuthStateChanged((user) => {
            //   debugger;
            //   if (user) { //user is null which indicates the account has signout from firebase auth
            //     subscription = from(user.getIdToken());
            //     this.renewToken(subscription, request, next, error);
            //   }
            // });

            sharedLogger('no fb auth user => goto login');
            this.authService.clearToken(); // TODO review

            firebase.auth().signOut();
            this.router.navigate(['/venture/login']);
          }
        }
      })
    );
  }

  // Call auth.refreshAccessToken(this is an Observable that will be returned)
  private renewToken(subscription, request, next, error) {
    return subscription.pipe(
      switchMap((token: any) => {
        logger('token refreshed');
        // When the call to refreshToken completes we reset the refreshTokenInProgress to false
        // for the next time the token needs to be refreshed
        this.refreshTokenInProgress = false;
        this.authService.updateToken(token);
        this.refreshTokenSubject.next(token);
        return next.handle(this.addAuthenticationToken(request, token));
      }),
      catchError((err: any) => {
        this.refreshTokenInProgress = false;
        firebase.auth().signOut();
        return throwError(error);
      })
    );
  }

  addAuthenticationToken(request, token) {
    const url = databaseURL || 'db-url-not-set';
    request = request.clone({
      url: `${url}${request.url}.json?auth=${token}`,
    });

    return request;
  }
}
