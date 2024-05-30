import { throwError } from 'rxjs';

export function handleError(error: Response | any) {
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
