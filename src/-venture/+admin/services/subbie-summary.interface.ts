export interface SubbieUser {
  email: string;
  name: string;
  uid: string;
}

export interface SubbieSummary {
  subbieUid: string;
  name: string;
  users: SubbieUser[];
}
