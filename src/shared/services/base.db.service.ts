import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BaseDbService {
  constructor() {}

  // A helper to add they Firebase Key to the returned item(s)
  addKeys(data) {
    if (!data) {
      return [];
    }
    const items = [];
    Object.keys(data).forEach((itemKey) => {
      items.push({
        uid: itemKey,
        ...data[itemKey],
      });
    });
    return items;
  }
}
