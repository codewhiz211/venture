import { Injectable } from '@angular/core';

export class EnvironmentConfiguration {
  production: boolean;
  serviceWorker: boolean;
  enableProdMode: boolean;
  env: string;
  version: string;
  commit: string;
  build: string;
}

@Injectable({
  providedIn: 'root',
})
export class EnvService {
  private _environment;

  get environment() {
    return this._environment;
  }

  constructor(environment: EnvironmentConfiguration) {
    this._environment = environment;
  }
}
