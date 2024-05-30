import { Job } from '@interfaces/job-model.interface';

export interface JobSummary {
  job: Job;
  specUid: string;
  subbieUid: string;
  jobUid: string;
}
