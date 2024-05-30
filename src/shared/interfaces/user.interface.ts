import { UserType } from '@auth/roles';

export interface User {
  email: string;
  name: string;
  role: UserType;
  permissions?: string[];
}
