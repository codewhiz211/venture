import { ReleaseNote, ReleaseNoteService } from '@services/release-notes.service';

import { Component } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'ven-app-chrome-notification-panel',
  templateUrl: './app-chrome-notification-panel.component.html',
  styleUrls: ['./app-chrome-notification-panel.component.scss'],
})
export class AppChromeNotificationPanelComponent {
  public releaseNotes$: Observable<ReleaseNote[]>;
  public releaseNotesCount$: Observable<number>;

  constructor(private releaseNotesService: ReleaseNoteService) {}

  ngOnInit() {
    this.releaseNotes$ = this.releaseNotesService.releaseNotes$;

    this.releaseNotesCount$ = this.releaseNotesService.releaseCount$;

    this.releaseNotesService.getReleaseNotes();
  }

  public close() {
    this.releaseNotesService.toggleReleaseNotes();
    this.releaseNotesService.markAsRead();
  }

  public devAddNotes() {
    // temp
    this.releaseNotesService.addReleaseNotes();
  }

  public devClearNotes() {
    // temp
    this.releaseNotesService.clearReleaseNotes();
  }
}
