import { RemedialStatus, StandardStatus } from './subbie';

import { Image } from './image.interface';

export interface Job {
  type: string;
  description: string;
  status: string;
  saved?: SavedInfo[];
  address?: string;
  subbieName?: string;
  isUrgent?: boolean;
  activity: JobActivity[];
}

export interface SavedInfo {
  [key: string]: boolean; //userUid:boolean
}

export interface JobActivity {
  date: number; //recording date
  step: string; //status
}

export interface JobCreatedInfo extends JobActivity {
  creator: string; // email address of creator
}

export interface JobScheduleInfo extends JobActivity {
  scheduler: string; //email address of user who scheduled this job.
  startDate: number; //the scheduled starting day in plan.
  dueDate: number; // the completing date in plan.
}

export interface JobCompletedInfo extends JobActivity {
  subbie: string;
  user: string; // subbie user name who marked completed
  comments?: string;
  images?: Image[];
}

export interface VerifiedInfo extends JobActivity {
  staff: string;
  feedback: string;
}

export interface DeclinedInfo extends JobActivity {
  staff: string;
  feedback: string;
}

export const StandardJobStatus = [StandardStatus.created, StandardStatus.scheduled, StandardStatus.completed];

// TODO Why is Pending not from RemedialStatus
export const RemedialJobStatus = [RemedialStatus.created, RemedialStatus.ready, 'PENDING', RemedialStatus.verified];

export const jobOrder = [
  'scheduled^standard',
  'ready^remedial',
  'created^remedial',
  'created^standard',
  'completed^remedial',
  'verified^remedial',
  'completed^standard',
];
