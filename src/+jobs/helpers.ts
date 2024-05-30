import { RemedialStatus, StandardStatus } from '../shared/interfaces/subbie';

import { dayInMilliseconds } from './constants';

export const getDuration = (date) => {
  return Math.ceil((Date.now() - date) / dayInMilliseconds);
};

export const getDisplayStatus = (status, type) => {
  return type === 'remedial' ? RemedialStatus[status] : StandardStatus[status];
};
