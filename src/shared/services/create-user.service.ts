import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { UserType } from '../../-auth/roles';

@Injectable({
  providedIn: 'root',
})
export class CreateUserService {
  constructor(private http: HttpClient, private storage: LocalStorageService) {}

  public getToken(): string {
    return this.storage.get('token');
  }

  public addPermission(uid: string = 'ohWjlNd1N9VjMprmBtMRnKp0qh33', permission: string = 'admin') {
    const endpoint = `https://us-central1-multiappdemo-d6999.cloudfunctions.net/admin/addPermission`;

    return this.http.post(endpoint, { uid, permission });
  }

  public removePermission(uid: string = 'ohWjlNd1N9VjMprmBtMRnKp0qh33', permission: string = 'admin') {
    const endpoint = `https://us-central1-multiappdemo-d6999.cloudfunctions.net/admin/removePermission`;

    return this.http.post(endpoint, { uid, permission });
  }

  // hard code for demo!
  public createClientUser(email: string = 'miinforma@googlemail.com', name: string = 'Rich Client') {
    const endpoint = `https://us-central1-multiappdemo-d6999.cloudfunctions.net/admin/createUser`;

    return this.http.post(endpoint, { email, name, role: UserType.Client });
  }

  // hard code for demo!
  public createStaffUser(email: string = 'richardjfield@gmail.com', name: string = 'Rich Staff') {
    const endpoint = `https://us-central1-multiappdemo-d6999.cloudfunctions.net/admin/createUser`;

    return this.http.post(endpoint, { email, name, role: UserType.Staff });
  }

  public createAdminUser(email, name) {
    // TODO don't create a new user. Assign admin permission to an existing Staff User.
    const endpoint = `https://us-central1-multiappdemo-d6999.cloudfunctions.net/admin/createUser`;
    return this.http.post(endpoint, { email, name, role: UserType.Staff });
  }
}
