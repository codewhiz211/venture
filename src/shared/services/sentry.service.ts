import * as Sentry from '@sentry/browser';

import { ErrorHandler, Injectable, Injector, Inject } from '@angular/core';

import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';
import { APP_CONFIG } from 'app.config';

@Injectable({
  providedIn: 'root',
})
export class SentryService implements ErrorHandler {
  private config;
  constructor(@Inject(APP_CONFIG) config, private injector: Injector, private storage: LocalStorageService) {
    this.config = config;
  }

  get router(): Router {
    return this.injector.get(Router);
  }

  handleError(error) {
    if (error.code && error.code === 401) {
      console.error('Not authorised');
      this.router.navigate(['/venture/login']);
    } else {
      this.setScope();
      const eventId = Sentry.captureException(error.originalError || error);
      if (this.config.production) {
        Sentry.showReportDialog({ eventId });
      } else {
        console.error(error);
      }
    }
  }

  logError(error) {
    Sentry.captureException(error.originalError || error);
  }

  private setScope() {
    const user = this.storage.get('user');
    if (user) {
      // user might be null if not signed in
      Sentry.configureScope((scope) => {
        scope.setUser({ email: user.email });
        scope.setTag('projectId', this.config.projectId);
        scope.setTag('env', this.config.env);
      });
    }
  }
}
