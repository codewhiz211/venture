import { InjectionToken } from '@angular/core';
import { NavMenuItem } from '@shell/nav-menu.service';
import { environment } from 'src/environments/environment';
import { firebaseConfig } from 'src/config/firebase.config';

export interface AppConfig {
  max_image_upload_bytes: number;
  max_image_upload_count: number;
  err_toast_timeout: number;
  toast_timeout: number;
  //
  build: string;
  commit: string;
  enableProdMode: boolean;
  env: string;
  isLocal: boolean;
  maxImageUploadBytes: number;
  maxImageUploadCount: number;
  navMenuItems: NavMenuItem[];
  production: boolean;
  projectId: string;
  serviceWorker: boolean;
  snackDuration?: number;
  useLocalFunctions?;
  version: string | number;
}

// https://angular.io/guide/dependencyinjection#injectiontoken
// https://gist.github.com/fernandohu/122e88c3bcd210bbe41c608c36306db9
export let APP_CONFIG = new InjectionToken<AppConfig>('app.config');

// 10000000 = 10MB
let process: any;
let maxUploadBytes = 10000000;
if (process && process.env.MAX_UPLOAD_SIZE) {
  maxUploadBytes = ((process.env.MAX_UPLOAD_SIZE as unknown) as number) * 1000000;
}

export const VENTURE_CONFIG: AppConfig = {
  useLocalFunctions: false,
  snackDuration: 3000,
  max_image_upload_bytes: maxUploadBytes,
  max_image_upload_count: 5,
  toast_timeout: 4000,
  err_toast_timeout: 10000,
  ...environment,
  isLocal: window.location.hostname === 'localhost' && window.location.port !== undefined,
  navMenuItems: [],
  maxImageUploadCount: 5,
  maxImageUploadBytes: 10000000,
  projectId: firebaseConfig.projectId,
};
