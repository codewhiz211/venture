export interface Subbie {
  subbieUid: string; // TODO uid
  name: string;
  users: SubbieUser[]; // TODO can be Record<string, boolean>
}

export interface SubbieListItem {
  uid: string;
  name: string;
}

export interface SubbieUser {
  email: string;
  name: string;
  isOnboard?: boolean;
  uid: string;
}
