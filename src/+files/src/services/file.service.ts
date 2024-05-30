import 'firebase/storage';

import * as firebase from 'firebase/app';

import { BehaviorSubject, throwError } from 'rxjs';

import { AuthService } from '@auth/services/auth.service';

import { CustomHttpParams } from '@shared/interceptors/custom-http.params';
import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { fileLogger } from '../file.logger';
import { map } from 'rxjs/operators';
import { APP_CONFIG } from 'app.config';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private config;
  private _files: BehaviorSubject<any[]>;
  private dataStore: {
    files: any[];
  };

  get files() {
    return this._files.asObservable();
  }

  constructor(@Inject(APP_CONFIG) config, private http: HttpClient, private authService: AuthService) {
    this.config = config;
    this.dataStore = { files: [] };
    this._files = new BehaviorSubject([]);
  }

  public getAllFiles(uid) {
    return this.http.get<any[]>(`/files/${uid}`).pipe(
      map((foldersAndFiles) => {
        if (!foldersAndFiles) {
          return [];
        }
        const files = [];
        // foldersAndFiles = Specs: { fileId: { filename: "file.jpg" }}
        Object.keys(foldersAndFiles).forEach((folderKey) => {
          const filesInFolder = foldersAndFiles[folderKey];
          Object.keys(filesInFolder).forEach((fileKey) => {
            files.push({
              folder: folderKey,
              fileId: fileKey,
              url: filesInFolder[fileKey].url,
              filename: filesInFolder[fileKey].filename,
            });
          });
        });
        return files;
      })
    );
  }

  public moveFile(uid, fuid, folderFrom, folderTo) {
    const endpoint = `https://us-central1-${this.config.projectId}.cloudfunctions.net/app/moveFileToFolder`;
    return this.http.post(endpoint, { uid, fuid, folderFrom, folderTo }).toPromise().catch(this.handleError);
  }

  public downloadFile(url, filename) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onload = function () {
      const myWindow: any = window;
      const urlCreator = myWindow.URL || myWindow.webkitURL;
      const imageUrl = urlCreator.createObjectURL(this.response);
      const tag = document.createElement('a');
      tag.setAttribute('download', filename);
      tag.setAttribute('href', imageUrl);
      document.body.appendChild(tag);
      tag.click();
      document.body.removeChild(tag);
    };
    xhr.send();
  }

  private mapFiles(uid, files) {
    const fileMetas = [];
    Object.keys(files).forEach((fileKey) => {
      fileMetas.push({
        uid,
        fuid: fileKey,
        ...files[fileKey],
      });
    });
    return fileMetas;
  }

  public getSectionFiles(uid, folder) {
    return this.http.get<any[]>(`/files/${uid}/${folder}`).pipe(
      map((data) => {
        if (!data) {
          return [];
        }
        return this.mapFiles(uid, data);
      })
    );
  }

  public getFolderFiles(uid, folder) {
    this.getFileMetas(uid, folder)
      .toPromise()
      .then((fileMetas: any) => {
        this.dataStore.files = fileMetas.sort((a, b) => this.sortByDate(a, b));
        this._files.next(Object.assign({}, this.dataStore).files);
      });
  }

  public addedSignedFile(snapId, folder, specId, newFileMeta) {
    return this.linkFile(snapId, folder, specId, newFileMeta);
  }

  public uploadFile(specId, folder, file) {
    fileLogger('uploadFile()');
    const fileId = this.uniqueID();
    const newFileMeta: any = {
      specId,
      filename: file.newname || file.name,
      uploadedBy: this.authService.authUser.email,
      uploadedDate: Date.now(),
      isImage: this.isImage(file.name),
      isEmail: this.isEmail(file.name),
      isPdf: this.isPdf(file.name),
    };

    const endpoint = `https://us-central1-${this.config.projectId}.cloudfunctions.net/app/uploadFile`;

    // here we tell our inteceptor to NOT add a content-type header
    const httpOptions = new CustomHttpParams(true);

    // it's necessary to use a form data object to get the boundary set correctly
    const fd = new FormData();
    fd.append('specId', specId);
    fd.append('fileId', fileId);
    fd.append('file', file, file.name);

    return this.http
      .post(endpoint, fd, {
        responseType: 'text',
        params: httpOptions,
      })
      .toPromise()
      .then(() => this.getDownloadUrl(specId, fileId))
      .then((url) => {
        fileLogger('url', url);
        newFileMeta.url = url;
        return this.linkFile(specId, folder, fileId, newFileMeta);
      })
      .then((fileInfo: any) => {
        // update local list
        newFileMeta.fuid = fileId;
        newFileMeta.url = fileInfo.url;
        this.dataStore.files.push(newFileMeta);
        this.dataStore.files = this.dataStore.files.sort((a, b) => this.sortByDate(a, b));
        this._files.next(Object.assign({}, this.dataStore).files);
        return newFileMeta;
      })
      .catch(this.handleError);
  }

  public deleteFile(uid, folder, fuid) {
    fileLogger('deleteFile()');
    // need to delete file from storage and the metadata from DB
    return this.http
      .delete(`/files/${uid}/${folder}/${fuid}`)
      .toPromise()
      .then(() => {
        const storageRef = firebase.storage().ref();
        const fileRef = storageRef.child(`${uid}/${fuid}`);
        return fileRef.delete().then(() => {
          const index = this.dataStore.files.findIndex((f) => f.fuid === fuid);
          this.dataStore.files.splice(index, 1);
          this._files.next(Object.assign({}, this.dataStore).files);
          return Promise.resolve();
        });
      });
  }

  deleteSignedSpec(uid, folder, fuid) {
    return this.http.delete(`/files/${uid}/${folder}/${fuid}`);
  }

  renameSignedSpec(uid, folder, fuid, filename) {
    return this.http.patch(`/files/${uid}/${folder}/${fuid}`, { filename });
  }

  private sortByDate(a, b) {
    const c = new Date(a.uploadedDate || a.date);
    const d = new Date(b.uploadedDate || b.date);
    return c > d ? -1 : c < d ? 1 : 0;
  }

  private getFileMetas(uid, folder) {
    fileLogger(`getFileMetas(${uid}, ${folder})`);
    return this.http.get<any[]>(`/files/${uid}/${folder}`).pipe(
      map((data) => {
        if (!data) {
          return [];
        }
        const fileMetas = [];
        Object.keys(data).forEach((fileKey) => {
          fileMetas.push({
            uid,
            fuid: fileKey,
            ...data[fileKey],
          });
        });
        return fileMetas;
      })
    );
  }

  private getDownloadUrl(uid, fuid) {
    const storage = firebase.storage();
    const pathReference = storage.ref(`${uid}/${fuid}`);
    return pathReference.getDownloadURL();
  }

  private linkFile(uid, folder, fileId, fileMeta) {
    fileLogger(`linkFile(${uid}, ${folder}, fileMeta)`);
    if (!folder) {
      folder = 'root';
    }
    return this.http.patch(`/files/${uid}/${folder}/${fileId}`, fileMeta).toPromise();
  }

  private isImage(filename) {
    // tslint:disable-next-line
    return (
      filename.toLowerCase().indexOf('.png') > -1 ||
      filename.toLowerCase().indexOf('.jpg') > -1 ||
      filename.toLowerCase().indexOf('.jpeg') > -1 ||
      filename.toLowerCase().indexOf('.bmp') > -1
    );
  }

  private isEmail(filename) {
    return filename.toLowerCase().indexOf('.eml') > -1;
  }

  private isPdf(filename) {
    return filename.toLowerCase().indexOf('.pdf') > -1;
  }

  private uniqueID() {
    // should be safe for 10M usages before possible collision
    // https://gist.github.com/gordonbrander/2230317
    function chr4() {
      return Math.random().toString(16).slice(-4);
    }

    return chr4() + chr4() + '-' + chr4() + '-' + chr4() + '-' + chr4() + '-' + chr4() + chr4() + chr4();
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
