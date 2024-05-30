import { BehaviorSubject, forkJoin, throwError } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import createLogger from 'debug';
import { map } from 'rxjs/operators';
import { APP_CONFIG } from 'app.config';

const logger = createLogger('ven:common');

@Injectable({
  providedIn: 'root',
})
export class FolderService {
  private config;
  private _folders: BehaviorSubject<any[]>;
  private _currentFolder: BehaviorSubject<string>;
  private dataStore: {
    folders: any[];
  };

  get folders() {
    return this._folders.asObservable();
  }

  get currentFolder() {
    return this._currentFolder.asObservable();
  }

  get getCurrentFolder() {
    return this._currentFolder.value;
  }

  constructor(@Inject(APP_CONFIG) config, private http: HttpClient) {
    this.config = config;
    this.dataStore = { folders: [] };
    this._folders = new BehaviorSubject([]);
    this._currentFolder = new BehaviorSubject('root');
  }

  public getFolders(uid) {
    // files are stored under folders
    // folders are stored under client uid
    return this.getFolderMetas(uid)
      .toPromise()
      .then((folders: any) => {
        this.dataStore.folders = folders;
        const newFolders = Object.assign({}, this.dataStore).folders;
        this._folders.next(newFolders);
        return newFolders;
      });
  }

  public setCurrentFolder(folder) {
    this._currentFolder.next(folder);
  }

  public addFolder(uid, folder) {
    return this.http.patch(`/folders/${uid}`, { [folder]: true }).toPromise();
  }

  public renameFolder(uid, oldName, newName) {
    logger(`renameFolder(${uid}, ${oldName}, ${newName})`);
    const endpoint = `https://us-central1-${this.config.projectId}.cloudfunctions.net/app/renameFolder`;
    return this.http.post(endpoint, { uid, oldName, newName }).toPromise().catch(this.handleError);
  }

  public deleteFolder(uid, folder) {
    const requests = [this.http.delete(`/folders/${uid}/${folder}`), this.http.delete(`/files/${uid}/${folder}`)];
    return forkJoin(requests).toPromise();
  }

  private getFolderMetas(uid) {
    return this.http.get<any[]>(`/folders/${uid}`).pipe(
      map((data) => {
        if (!data) {
          return [];
        }
        const folders = [];
        Object.keys(data).forEach((folderName) => {
          folders.push(folderName);
        });
        return folders;
      })
    );
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body: any = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return throwError(errMsg);
  }
}
