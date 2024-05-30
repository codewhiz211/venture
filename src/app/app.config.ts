// import { InjectionToken } from '@angular/core';

// export interface AppConfig {
//   snackDuration: number;
//   max_image_upload_bytes: number;
//   max_image_upload_count: number;
//   err_toast_timeout: number;
//   toast_timeout: number;
// }

// // https://gist.github.com/fernandohu/122e88c3bcd210bbe41c608c36306db9
// export let APP_CONFIG = new InjectionToken<AppConfig>('app.config');

// // 10000000 = 10MB
// let process: any;
// let maxUploadBytes = 10000000;
// if (process && process.env.MAX_UPLOAD_SIZE) {
//   maxUploadBytes = ((process.env.MAX_UPLOAD_SIZE as unknown) as number) * 1000000;
// }

// export const VENTURE_CONFIG: AppConfig = {
//   snackDuration: 3000,
//   max_image_upload_bytes: maxUploadBytes,
//   max_image_upload_count: 5,
//   toast_timeout: 4000,
//   err_toast_timeout: 10000,
// };
