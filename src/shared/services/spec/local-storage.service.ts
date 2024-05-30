import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {
  private readonly appKey: string = 'venture';

  get(name) {
    const key = `${this.appKey}.${name}`;
    const data = sessionStorage.getItem(key);
    return JSON.parse(data);
  }

  getAllByPrefix(prefix): string[] {
    const arr = []; // Array to hold the keys
    // Iterate over sessionStorage and insert the keys that meet the condition into arr
    for (let i = 0; i < sessionStorage.length; i++) {
      if (sessionStorage.key(i).startsWith(prefix)) {
        arr.push(sessionStorage.key(i));
      }
    }
    return arr;
  }

  remove(name) {
    const key = `${this.appKey}.${name}`;
    sessionStorage.removeItem(key);
  }

  removeThirdParty(name) {
    // dont prefix with app key
    sessionStorage.removeItem(name);
  }

  save(name, data) {
    const key = `${this.appKey}.${name}`;
    sessionStorage.setItem(key, JSON.stringify(data));
  }
}
