import { Job } from './job-model.interface';

export interface JobSummary {
  job: Job;
  specUid: string;
  subbieUid: string;
  jobUid: string;
}
