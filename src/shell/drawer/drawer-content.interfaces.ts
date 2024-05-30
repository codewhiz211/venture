export interface IDrawerContentComponent {
  data: any;
}

export type EVENT_TYPE =
  | 'signAll'
  | 'signSection'
  | 'userAdded'
  | 'clientAdded'
  | 'subbieAdded'
  | 'subbieEdited'
  | 'resumeTracking'
  | 'exitTracking'
  | 'userPermissionsUpdated'
  | 'userEdited'
  | 'userDeleted';

type EVENT_TYPE_OBJECT = Record<EVENT_TYPE, any>;

export const EVENT_TYPES: EVENT_TYPE_OBJECT = {
  userAdded: 'user-added',
  userEdited: 'user-updated',
  userDeleted: 'user-deleted',
  subbieAdded: 'subbie-added',
  subbieEdited: 'subbieEdited',
  clientAdded: 'client-added',
  signAll: 'sign-all',
  signSection: 'sign-section',
  resumeTracking: 'resume',
  userPermissionsUpdated: 'user-permissions-updated',
  exitTracking: 'exit',
};

export interface IDrawerEvent {
  type?: EVENT_TYPE;
  data: any;
  component?: any;
}
