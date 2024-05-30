import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DevService {
  constructor(private http: HttpClient) {}

  clearAnonUsers() {
    return this.http.post('/functions/admin/clearAnonUsers', {});
  }
}
