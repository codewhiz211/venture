import 'firebase/storage';

import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { Checklist, checklistJson } from '@interfaces/checklist.data';

import { AuthService } from '@auth/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ChecklistService {
  private _checklists: BehaviorSubject<any[]>;

  get checklists() {
    return this._checklists.asObservable();
  }

  constructor(private http: HttpClient, private authService: AuthService) {
    this._checklists = new BehaviorSubject([]);
  }

  getAllChecklists(uid) {
    return this.http.get<any[]>(`/checklists/${uid}`).pipe(
      map((checklistsRes) => {
        if (!checklistsRes) {
          return [];
        }
        const checklists = [];
        Object.keys(checklistsRes).forEach((checklistKey) => {
          const checklist = checklistsRes[checklistKey];
          checklists.push(checklist);
        });
        return checklists;
      })
    );
  }

  public createChecklists(specId) {
    // Grab the checklist json
    const checklistsJson = checklistJson;
    const updates = [];
    // Create a node for each item
    checklistsJson.forEach((checklist) => {
      updates.push(this.http.put<any[]>(`/checklists/${specId}/${checklist.name}`, checklist));
    });
    return forkJoin(updates);
  }

  public updateChecklist(uid, cuid, updatedChecklist): Observable<Checklist> {
    return this.http.patch<Checklist>(`/checklists/${uid}/${cuid}`, updatedChecklist);
  }
}
