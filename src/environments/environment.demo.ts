// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// DEMO Env will use test (dev) branch and settings, but a new demo Hosting, DB and Auth
export const environment = {
  production: false,
  serviceWorker: true,
  enableProdMode: false,
  env: 'TEST',
  version: 'APP_VERSION',
  commit: 'CI_COMMIT_ID',
  build: 'CI_BUILD_URL',
  jobCreatedEmailTemplateId: 'd-6b621c3f6cc04e6182520a1348f06ef5',
  jobUpdatedEmailTemplateId: 'd-3511b4ba62674d6ea97dab73aa743ed4',
  remedialCreatedEmailTemplateId: 'd-8b8144ddcef148fcaceeddfaf77ae34f',
  remedialUpdatedEmailTemplateId: 'd-62ffa4882e484123b628283a018ce9df',
  remedialSubmittedEmailTemplateId: 'd-bb8d887a50704ec39647ea3191153975',
  shareFilesEmailTemplateId: 'd-ccce123f3cd04608807816d57b6ef555',
  shareSpecEmailTemplateId: 'd-224ddb818fa64f91a08047a28b5c5df0',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
