export interface UserSummary {
  uid: string;
  email: string;
  name: string;
  role: string;
  // isAdmin: boolean;
  permissions: string[] | undefined;
}
