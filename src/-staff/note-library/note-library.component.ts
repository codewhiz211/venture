import { Component, OnInit } from '@angular/core';

import { AppChromeDetailsPageFooterConfig } from '@shell/app-chrome-details-page-footer/app-chrome-details-page-footer.component';
import { BaseComponent } from '@shared/components/base.component';
import { DialogService } from '@shell/dialogs/dialog.service';
import { NoteComponent } from './note/note.component';
import { NoteService } from '../services/note.service';
import { NoteTableComponent } from './note-table/note-table.component';
import { skipWhile } from 'rxjs/operators';

@Component({
  selector: 'app-note-library',
  templateUrl: './note-library.component.html',
  styleUrls: ['./note-library.component.scss'],
})
export class NoteLibraryComponent extends BaseComponent implements OnInit {
  public headerConfig;
  public contentConfig;
  public footerConfig: AppChromeDetailsPageFooterConfig;

  constructor(private dialogService: DialogService, private noteService: NoteService) {
    super();
  }

  ngOnInit(): void {
    this.headerConfig = this.getHeaderConfig();
    this.contentConfig = this.getContentConfig();
    this.footerConfig = this.getFooterConfig();
  }

  private getHeaderConfig() {
    return {
      title: 'Pricing Notes',
    };
  }

  private getContentConfig() {
    return [
      {
        label: 'Note table',
        id: 'note-table',
        component: NoteTableComponent,
      },
    ];
  }

  private getFooterConfig(): AppChromeDetailsPageFooterConfig {
    return {
      type: 'forceSpeedDial',
      actions: [
        {
          icon: 'add',
          label: () => 'Add a note',
          action: () => this.addNote(),
          shownOnDesktop: true,
          primary: true,
          tabs: ['note-table'],
        },
      ],
    };
  }

  private addNote() {
    this.dialogService
      .open(NoteComponent, { dialogTitle: 'Add pricing note' })
      .pipe(
        this.takeUntilDestroy(),
        skipWhile((v) => !v)
      )
      .subscribe((note) => {
        this.noteService.add(note);
      });
  }
}
