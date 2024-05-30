import { BehaviorSubject, Observable, of } from 'rxjs';
import { Subbie, SubbieListItem, SubbieUser } from '../../interfaces/subbie-model.interface';
import { map, switchMap } from 'rxjs/operators';

import { AuthService } from '@auth/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Job } from '../../interfaces/job-model.interface';
import createLogger from 'debug';

const logger = createLogger('ven:common:subbies:job');

@Injectable({
  providedIn: 'root',
})
export class SubbieJobService {
  private _subbies: BehaviorSubject<Subbie[]> = new BehaviorSubject(null);
  public readonly subbies$: Observable<Subbie[]> = this._subbies.asObservable();
  private subbies: Subbie[];
  private _subbieJobs: BehaviorSubject<Job[]> = new BehaviorSubject(null);
  public readonly subbieJobs$: Observable<Job[]> = this._subbieJobs.asObservable();
  private specUid;

  private tempDeletedJob = {};

  constructor(private http: HttpClient, private authService: AuthService) {}

  loadSubbies() {
    const endpoint = `/functions/app/subbies?withUsers=true`;
    this.http.get(endpoint).subscribe((subbies: Subbie[]) => {
      this.subbies = subbies;
      this._subbies.next(subbies);
    });
  }

  getSubbieList(): Observable<SubbieListItem[]> {
    return this.subbies$.pipe(
      map((subbies: Subbie[]) => {
        return subbies.map((s) => ({ uid: s.subbieUid, name: s.name }));
      })
    );
  }

  getAllEmailsUnderSubbie(subbieUid): Observable<string[]> {
    return this.subbies$.pipe(
      map((subbies) => {
        const subbie = subbies.find((s) => s.subbieUid === subbieUid); // assume subbie exists
        const users: SubbieUser[] = subbie.users;
        return users.map((user) => user.email);
      })
    );
  }

  getSubbieJobs(specUid, refresh = false): void {
    //If the jobs under same spec have loaded, skip to request DB, which makes loading faster
    if (specUid != this.specUid || refresh) {
      this.http.get(`/jobs/${specUid}`).subscribe((subbieJobs: Job[]) => {
        this._subbieJobs.next(subbieJobs);
        this.specUid = specUid;
      });
    }
  }

  getSubbieUid(userUid: string) {
    return this.http.get(`/users/${userUid}/subbieUid`);
  }

  getSubbieName(subbieUid): string {
    if (this.subbies == undefined) {
      throw Error('Subbies has not been loaded yet');
    }
    if (subbieUid == undefined || subbieUid === 'unassigned') {
      return 'TBC';
    }
    const subbie = this.subbies.find((subbie) => subbie.subbieUid == subbieUid);
    return subbie ? subbie.name : 'TBC';
  }

  deleteJob(specUid, subbieUid, jobUid, job): Observable<any> {
    this.tempDeletedJob = { ...this.tempDeletedJob, ...{ [specUid]: { [jobUid]: job } } };
    logger('tempJob', this.tempDeletedJob);
    return this.http.delete(`/jobs/${specUid}/${subbieUid}/${jobUid}`);
  }

  restoreJobs(specUid, subbieUid, jobUid): Observable<any> {
    if (this.tempDeletedJob[specUid][jobUid]) {
      return this.http.put(`/jobs/${specUid}/${subbieUid}/${jobUid}`, this.tempDeletedJob[specUid][jobUid]);
    } else {
      return of(null);
    }
  }

  addSubbieJob(job: Job, specUid, subbieUid = 'unassigned'): Observable<any> {
    //@ts-ignore
    job.activity = [{ creator: this.authService.authUser?.email, date: Date.now(), step: 'created' }];
    job.status = 'created';
    this.getReadyInfo(job, subbieUid);
    subbieUid = subbieUid === '' ? 'unassigned' : subbieUid;
    return this.http.post(`/jobs/${specUid}/${subbieUid}`, job);
  }

  updateJobsUnderSpec(data, specUid) {
    this.http
      .get(`jobs/${specUid}`)
      .pipe(
        switchMap((jobs) => {
          Object.keys(jobs).forEach((subbieUid) => {
            Object.keys(jobs[subbieUid]).forEach((jobUid) => {
              jobs[subbieUid][jobUid] = { ...jobs[subbieUid][jobUid], ...data };
            });
          });
          return this.http.put(`/jobs/${specUid}`, jobs);
        })
      )
      .subscribe();
  }

  updateJob(data, specUid, subbieUid, jobUid, originalSubbie) {
    logger('updateData', data);
    logger('originalSubbie', originalSubbie);
    //If subbie is changed, job under original subbie should be deleted.
    if (subbieUid !== originalSubbie) {
      this.http.delete(`/jobs/${specUid}/${originalSubbie}/${jobUid}`).subscribe();
    }
    this.getReadyInfo(data, subbieUid);
    return this.http.patch(`/jobs/${specUid}/${subbieUid}/${jobUid}`, data);
  }

  updateJobWithoutChangingSubbie(data, specUid, subbieUid, jobUid) {
    logger('updateDataActivity', data);
    return this.http.patch(`/jobs/${specUid}/${subbieUid}/${jobUid}`, data);
  }

  updateJobSavedStatus(specUid, subbieUid, jobUid, savedStatus) {
    logger('updateJobSavedStatus', savedStatus);
    const userUid = this.authService.authUser?.uid;
    return this.http.patch(`/jobs/${specUid}/${subbieUid}/${jobUid}/saved`, { [userUid]: savedStatus });
  }

  private getReadyInfo(job: Job, subbieUid) {
    if (job.type == 'remedial' && job.type && job.description && subbieUid !== '') {
      job.activity.push({ date: Date.now(), step: 'ready' });
      job.status = 'ready';
    }
  }
}
