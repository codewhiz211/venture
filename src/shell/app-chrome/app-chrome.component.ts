import { AuthService } from '@auth/services/auth.service';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ReleaseNoteService } from '@services/release-notes.service';

// This component displays the side menu, header and footer styles

@Component({
  selector: 'ven-application-chrome',
  templateUrl: './app-chrome.component.html',
  styleUrls: ['./app-chrome.component.scss'],
})
export class AppChromeComponent {
  public showReleaseNotes$: Observable<boolean>;

  constructor(public authService: AuthService, private releaseNotesService: ReleaseNoteService) {
    this.showReleaseNotes$ = this.releaseNotesService.showReleaseNotes$;
  }
}
