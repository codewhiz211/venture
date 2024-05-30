import { Component, OnInit } from '@angular/core';

import { BaseComponent } from '@shared/components/base.component';
import { Column } from '@shared/components/ven-table/columns.interface';
import { DialogService } from '@shell/dialogs/dialog.service';
import { NoteComponent } from '../note/note.component';
import { NoteService } from 'src/-staff/services/note.service';
import { skipWhile } from 'rxjs/operators';

@Component({
  selector: 'app-note-table',
  templateUrl: './note-table.component.html',
  styleUrls: ['./note-table.component.scss'],
})
export class NoteTableComponent extends BaseComponent implements OnInit {
  public columns: Column[];
  public notes$;

  constructor(private noteService: NoteService, private dialogService: DialogService) {
    super();
  }

  ngOnInit(): void {
    this.initialData();
    this.initialColumns();
  }

  private initialData() {
    //get notes
    this.notes$ = this.noteService.notes$;
    this.noteService.getNotes();
  }

  private initialColumns() {
    this.columns = [
      { accessor: 'note', label: 'Note', width: '90%', mobileWidth: '90%', class: 'add-padding' },
      {
        accessor: 'edit',
        label: 'Edit',
        type: 'operator',
        icon: 'more_vert',
        children: [
          { name: 'Edit', icon: 'edit' },
          { name: 'Delete', icon: 'delete' },
        ],
        width: '10%',
        mobileWidth: '10%',
        class: 'pull-right',
      },
    ];
  }

  editNote({ row, action }) {
    if (action == 'Edit') {
      this.dialogService
        .open(NoteComponent, { data: row, dialogTitle: 'Edit pricing note' })
        .pipe(
          this.takeUntilDestroy(),
          skipWhile((v) => !v)
        )
        .subscribe((data) => {
          this.noteService.edit(data);
        });
    } else if (action == 'Delete') {
      this.noteService.delete(row);
    }
  }
}
