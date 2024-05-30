import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { sort as ramdaSort } from 'ramda';

export interface ReleaseNote {
  date: number;
  title: string;
  markdown: string;
  version: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReleaseNoteService {
  private releaseNotes: BehaviorSubject<ReleaseNote[]> = new BehaviorSubject([]);
  public readonly releaseNotes$: Observable<ReleaseNote[]> = this.releaseNotes.asObservable();

  private showReleaseNotes: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public readonly showReleaseNotes$: Observable<boolean> = this.showReleaseNotes.asObservable();

  private releaseCount: BehaviorSubject<number> = new BehaviorSubject(0);
  public readonly releaseCount$: Observable<number> = this.releaseCount.asObservable();

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {}

  toggleReleaseNotes() {
    this.showReleaseNotes.next(!this.showReleaseNotes.value);
  }

  getNewReleaseNoteCount() {
    // to determine if a user has seen a release note or not, we check each notes date against the date stored in LS
    // the date stored in LS is the most recent note viewed by the user
    let userMostRecent = this.localStorageService.get('lastReleaseNote', true);

    if (!userMostRecent) {
      userMostRecent = 0;
    }

    return this.http
      .get<ReleaseNote>('/release-notes')
      .pipe(map((response) => this.objectValuesToArray(response)))
      .subscribe((releaseNotes) => {
        const sorted = ramdaSort(this.sortByDate, releaseNotes);
        const filtered = sorted.filter((r) => r.date > userMostRecent);
        this.releaseCount.next(filtered.length);
      });
  }

  getReleaseNotes() {
    return this.http
      .get<ReleaseNote>('/release-notes-data')
      .pipe(map((response) => this.objectValuesToArray(response)))
      .subscribe((releaseNotes) => {
        const sorted = ramdaSort(this.sortByDate, releaseNotes);
        this.releaseNotes.next(sorted);
      });
  }

  public markAsRead() {
    // store the date of the most recent release note in LS
    const mostRecentNote = this.releaseNotes.value[0];
    this.localStorageService.save('lastReleaseNote', mostRecentNote.date, true);
    this.getNewReleaseNoteCount();
  }

  // add to a base service
  private objectValuesToArray = (inputObject) => {
    if (!inputObject) {
      return [];
    }
    const array = [];
    Object.keys(inputObject).forEach((key) => {
      array.push(inputObject[key]);
    });
    return array;
  };

  private sortByDate(a, b) {
    return b.date - a.date;
  }

  // TEMP
  public addReleaseNotes() {
    this.localStorageService.remove('lastReleaseNote', true);

    this.addReleaseNoteForTest({
      date: Date.now(),
      title: 'New Design',
      version: '4.0.0',
      markdown: '### Some Header ![village.png](https://media.tacdn.com/media/attractions-splice-spp-674x446/06/e7/21/80.jpg)',
    });

    this.addReleaseNoteForTest({
      date: Date.now(),
      title: 'Bug Fix',
      version: '4.0.1',
      markdown: '### Some Header ![village.png](https://media.tacdn.com/media/attractions-splice-spp-674x446/06/e7/21/80.jpg)',
    });

    this.addReleaseNoteForTest({
      date: Date.now(),
      title: 'New Feature',
      version: '4.1.0',
      markdown: '### Some Header ![village.png](https://media.tacdn.com/media/attractions-splice-spp-674x446/06/e7/21/80.jpg)',
    });

    this.getReleaseNotes();
    this.getNewReleaseNoteCount();
    this.toggleReleaseNotes();
  }
  public clearReleaseNotes() {
    this.localStorageService.remove('lastReleaseNote', true);
    this.http.delete('/release-notes').subscribe();

    this.http.delete('/release-notes-data').subscribe();

    this.getReleaseNotes();
    this.getNewReleaseNoteCount();
    this.toggleReleaseNotes();
  }
  private addReleaseNoteForTest(releaseNote) {
    return this.http
      .post('/release-notes-data', releaseNote)
      .toPromise()
      .then((response: any) => {
        return this.http.put(`/release-notes/${response.name}`, { date: releaseNote.date }).toPromise();
      });
  }
}
