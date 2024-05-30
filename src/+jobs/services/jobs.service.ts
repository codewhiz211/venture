import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JobSummary } from '@interfaces/job-summary.interface';
import { PreferenceService } from '@services/preference.service';
import { jobOrder } from '../../shared/interfaces/job-model.interface';
import { keys } from 'ramda';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class JobsService {
  private _jobs: ReplaySubject<JobSummary[]> = new ReplaySubject(null);
  public readonly jobs$: Observable<JobSummary[]> = this._jobs.asObservable();

  //as scheduledJobs and activeDate is changed by schedule calendar month, can't go with jobs, we leave them as independent subject
  private _scheduledJobs: BehaviorSubject<JobSummary[]> = new BehaviorSubject(null);
  public readonly scheduledJobs$: Observable<JobSummary[]> = this._scheduledJobs.asObservable();
  private scheduledJobs: JobSummary[];
  public _activeDate: BehaviorSubject<Date> = new BehaviorSubject(new Date()); //For blank scheduled job card
  public activeDate$: Observable<Date> = this._activeDate.asObservable();

  constructor(private http: HttpClient) {}

  getJob(specUid: string, subbieUid: string, jobUid: string) {
    return this.http.get(`/jobs/${specUid}/${subbieUid}/${jobUid}`);
  }

  getOutstandingRemedialJobs(jobs) {
    const outStandingRemedialJobs = [];
    jobs.forEach((jobItem) => {
      const job = jobItem.job;
      if (job.type == 'remedial' && job.status == 'ready') {
        outStandingRemedialJobs.push(jobItem);
      }
    });
    return outStandingRemedialJobs;
  }

  loadAllJobsUnderSubbie(subbieUid: string): Observable<void> {
    return this.http.get(`/jobs/`).pipe(
      map((jobsObj) => {
        const jobArrays = this.getJobArrays(jobsObj, subbieUid);
        this.scheduledJobs = this.getScheduledJobs(jobArrays);
        this.orderJobsByStatus(jobArrays);
        this._jobs.next(jobArrays);
        return;
      })
    );
  }

  //TODO: Subbie name is relatively static to one user, so consider to just load just one time when subbie user login.
  getSubbieName(subbieUid) {
    return this.http.get(`/subbies/${subbieUid}/name`);
  }

  private orderJobsByStatus(jobs) {
    jobs.sort((j1, j2) => {
      const j1StAndType = `${j1.job.status}^${this.getType(j1.job.type)}`;
      const j2StAndType = `${j2.job.status}^${this.getType(j2.job.type)}`;
      const orderJ1 = jobOrder.indexOf(j1StAndType);
      const orderJ2 = jobOrder.indexOf(j2StAndType);
      return orderJ1 - orderJ2;
    });
  }

  getScheduledJobs(jobs) {
    return jobs.filter((jobItem) => jobItem.job.status == 'scheduled');
  }

  getScheduleDates(jobs) {
    const scheduleDates = this.getScheduledJobs(jobs).map((jobItem) => new Date(this.getActivityInfo(jobItem.job, 'scheduled')?.dueDate));
    return scheduleDates;
  }

  private getType(type) {
    if (!type) {
      return 'TBC';
    }
    return type.includes('standard') ? 'standard' : 'remedial';
  }

  loadScheduleByMonth(date: Date) {
    if (!this.scheduledJobs) {
      return;
    }
    const asj = this.scheduledJobs
      .filter((jobItem) => {
        const scheduleInfo = this.getActivityInfo(jobItem.job, 'scheduled');
        const sd = new Date(scheduleInfo.dueDate);
        return sd.getFullYear() === date.getFullYear() && sd.getMonth() === date.getMonth();
      })
      .sort((item1, item2) => this.getActivityInfo(item1.job, 'scheduled').dueDate - this.getActivityInfo(item2.job, 'scheduled').dueDate);
    this._scheduledJobs.next(asj);
    if (asj.length == 0) {
      this._activeDate.next(date);
    }
  }

  public getActivityInfo(job, status) {
    return job.activity.find((activity) => activity.step == status);
  }

  private getJobArrays(jobsObj, subbieUid) {
    const jobs = [];
    keys(jobsObj).forEach((specUid) => {
      keys(jobsObj[specUid]).forEach((sUid) => {
        if (subbieUid == sUid) {
          keys(jobsObj[specUid][subbieUid]).forEach((jobUid) => {
            jobs.push({ job: jobsObj[specUid][subbieUid][jobUid], jobUid, subbieUid: sUid, specUid });
          });
        }
      });
    });
    return jobs;
  }
}
