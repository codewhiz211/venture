import { BehaviorSubject, Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { clone } from 'ramda';
import { preDefinedNotes } from './pre-defined-notes';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  private _notes: BehaviorSubject<any[]> = new BehaviorSubject(this.convertToDisplayNote(preDefinedNotes));
  public readonly notes$: Observable<any[]> = this._notes.asObservable();

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  get notes() {
    return this._notes.getValue();
  }

  getNotes() {
    this.http.get('/notes').subscribe((notes) => {
      if (!notes) {
        return;
      }
      this._notes.next(this.convertToDisplayNote(notes));
    });
  }

  add(note) {
    const notes = clone(this.notes);
    notes.push({ note: note.note, id: notes.length });
    this._notes.next(notes);
    this.updateNotes(notes).subscribe(() => {
      this.snackBar.open('Note has been added to the library');
    });
  }

  edit(note) {
    const notes = clone(this.notes);
    notes.splice(note.id, 1, note);
    this._notes.next(notes);
    this.updateNotes(notes).subscribe(() => {
      this.snackBar.open('Note has been updated');
    });
  }

  delete(note) {
    //trigger angular changeDetection with clone (object should be changed);
    const notes = clone(this.notes);
    notes.splice(note.id, 1);
    this._notes.next(notes);
    this.updateNotes(notes).subscribe(() => {
      this.snackBar.open('Note has been removed from the library');
    });
  }

  updateNotes(notes) {
    return this.http.put('/notes', this.convertToDBNote(notes));
  }

  //displaying note [{note:'note message'},...]
  private convertToDisplayNote(notes) {
    return notes.map((note, i) => {
      return { note, id: i };
    });
  }

  // db note ['note message',...]
  private convertToDBNote(notes) {
    return notes.map((n) => {
      return n.note;
    });
  }
}
