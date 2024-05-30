import { of } from 'rxjs';

export class MockAuthService {
  authUser = {
    type: 'staff',
    isAnonymous: false,
    email: 'mock@mail.com',
    name: 'Mock User',
    permissions: [''],
    uid: '',
  };
  authUser$ = () => {
    return of(this.authUser);
  };
}
