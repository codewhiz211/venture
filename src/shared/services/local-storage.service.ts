import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly appKey: string = 'venture';

  get(name, local = false) {
    const key = `${this.appKey}.${name}`;
    if (local) {
      const data = localStorage.getItem(key);
      return JSON.parse(data);
    } else {
      const data = sessionStorage.getItem(key);
      return JSON.parse(data);
    }
  }

  getCurrentUserEmail() {
    return this.get('user').email;
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

  remove(name, local = false) {
    const key = `${this.appKey}.${name}`;
    if (local) {
      localStorage.removeItem(key);
    } else {
      sessionStorage.removeItem(key);
    }
  }

  removeThirdParty(name) {
    // don't prefix with app key
    sessionStorage.removeItem(name);
  }

  save(name, data, local = false) {
    const key = `${this.appKey}.${name}`;
    if (local) {
      localStorage.setItem(key, JSON.stringify(data));
    } else {
      sessionStorage.setItem(key, JSON.stringify(data));
    }
  }
}
