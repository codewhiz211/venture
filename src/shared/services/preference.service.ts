import { BehaviorSubject, Observable } from 'rxjs';

import { AuthService } from '@auth/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Preference } from '@auth/types';

// To get user's saved job and spec
@Injectable({
  providedIn: 'root',
})
export class PreferenceService {
  private userUid;

  private _savedSpecs: BehaviorSubject<Record<string, boolean>[]> = new BehaviorSubject([]);
  public readonly savedSpecs$: Observable<Record<string, boolean>[]> = this._savedSpecs.asObservable();
  private _savedJobs: BehaviorSubject<any[]> = new BehaviorSubject([]);
  public readonly savedJobs$: Observable<any[]> = this._savedJobs.asObservable();
  private _savedPricing: BehaviorSubject<Record<string, boolean>[]> = new BehaviorSubject([]);
  public readonly savedPricing$: Observable<any[]> = this._savedPricing.asObservable();

  constructor(private authService: AuthService, private http: HttpClient, private snackBar: MatSnackBar) {}

  //Init the preference on the shell (AppChromeContentContainerComponent) but not handleAuthStateChange in auth service as event emit from handleAuthStateChange can't trigger ng change detection
  init() {
    this.userUid = this.authService.authUser.uid;
    this.loadPreference();
  }

  loadPreference() {
    return this.http.get(`/users/${this.userUid}/preference`).subscribe((preference: Preference) => {
      if (!preference) {
        return;
      }
      if (preference.savedSpecs) {
        this._savedSpecs.next(preference.savedSpecs);
      }
      if (preference.savedJobs) {
        this._savedJobs.next(preference.savedJobs);
      }
      if (preference.savedPricingSpec) {
        this._savedPricing.next(preference.savedPricingSpec);
      }
    });
  }

  get savedSpecs() {
    return this._savedSpecs.getValue();
  }

  get savedJobs() {
    return this._savedJobs.getValue();
  }

  get savedPricing() {
    return this._savedPricing.getValue();
  }

  //itemUid: specUid for savedSpecs, jobUid for savedJobs
  handleSavedItemToggle(flag: 'specs' | 'jobs' | 'pricing', itemUid, isSaved) {
    const config = {
      specs: {
        section: 'savedSpecs',
        message: isSaved ? 'Added to Saved Builds' : 'Removed from Saved Builds',
      },
      jobs: {
        section: 'savedJobs',
        message: isSaved ? 'Job added to homepage' : 'Job removed from homepage',
      },
      pricing: {
        section: 'savedPricingSpec',
        message: isSaved ? 'Job added to Saved Jobs' : 'Job removed from Saved Jobs',
      },
    };
    this.http.patch(`/users/${this.userUid}/preference/${config[flag].section}`, { [itemUid]: isSaved }).subscribe(() => {
      this.snackBar.open(config[flag].message);
      this.loadPreference();
    });
  }
}
