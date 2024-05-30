import * as Sentry from '@sentry/browser';

import { APP_CONFIG, VENTURE_CONFIG } from 'app.config';
import { ErrorHandler, LOCALE_ID, NgModule } from '@angular/core';
import { angularMaterialModules, angularModules } from './app.module.imports';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthActionComponent } from './login/components/auth-action/auth-action.component';
import { ChangePasswordComponent } from './login/components/change-password/change-password.component';
import { ContentComponent } from './login/components/content/content.component';
import { ForbiddenComponent } from './login/components/forbidden/forbidden.component';
import { ForgotPasswordComponent } from './login/components/forgot-password/forgot-password.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MarkdownModule } from 'ngx-markdown';
import { PageNotFoundComponent } from './login/components/not-found/not-found.component';
import { ResetPasswordComponent } from './login/components/reset-password/reset-password.component';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { SentryService } from '@services/sentry.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { SetBaseInterceptorService } from '@shared/interceptors/set-base-interceptor.service';
import { SharedModule } from '@shared/shared.module';
import { ShellModule } from '@shell/shell.module';
import { SignInComponent } from './login/components/sign-in/sign-in.component';
import lcoaleEnAU from '@angular/common/locales/en-AU';
import { registerLocaleData } from '@angular/common';

Sentry.init({
  dsn: 'https://fecad105b96142d7a69d8b9c190fad8b@sentry.io/1295847',
  environment: VENTURE_CONFIG.env,
  release: `VENTURE: ${VENTURE_CONFIG.version}`,
});

registerLocaleData(lcoaleEnAU);

if (VENTURE_CONFIG.serviceWorker && 'serviceWorker' in navigator) {
  navigator.serviceWorker
    .getRegistration()
    .then((active) => !active && navigator.serviceWorker.register('/ngsw-worker.js'))
    .catch(console.error);
}

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    ContentComponent,
    PageNotFoundComponent,
    ForbiddenComponent,
    ForgotPasswordComponent,
    ChangePasswordComponent,
    AuthActionComponent,
    ResetPasswordComponent,
  ],
  imports: [
    ...angularModules,
    ...angularMaterialModules,
    ScrollToModule.forRoot(),
    ShellModule,
    SharedModule,
    AppRoutingModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: VENTURE_CONFIG.serviceWorker }),
  ],
  exports: [],
  entryComponents: [],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: SetBaseInterceptorService, multi: true },
    { provide: APP_CONFIG, useValue: VENTURE_CONFIG },
    { provide: ErrorHandler, useClass: SentryService },
    { provide: LOCALE_ID, useValue: 'en-AU' },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: VENTURE_CONFIG.snackDuration } },
    //To avoid mat-stepper default icon loading
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
