import { UserType } from './roles';

export interface CreateSessionResponse {
  user: {
    email: string | undefined;
    name: string | undefined;
    type: string;
    uid: string;
  };
}

export interface SessionUser {
  token: string;
  type: string;
}

export interface AuthUser {
  type: UserType; // need to think how we will handle type for Anonymous users!
  defaultPassword: boolean;
  isAnonymous?: boolean;
  email?: string;
  name?: string;
  permissions?: string[];
  uid: string;
  subbieUid?: string;
}

export interface AnonymousUser {
  isAnonymous: boolean;
  type: UserType;
}

export interface Preference {
  savedSpecs?: Record<string, boolean>[];
  savedJobs?: Record<string, boolean>[];
  savedPricingSpec?: Record<string, boolean>[];
}
