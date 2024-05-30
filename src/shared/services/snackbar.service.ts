import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { keys } from 'ramda';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  private snackBars = {};

  constructor(private snackBar: MatSnackBar) {}

  open(message: string, action?: string, options?: any) {
    const snack = this.snackBar.open(message, action, options);

    return this.addToList(snack);
  }

  public close(id: string) {
    const snack = this.snackBars[id];
    snack.dismiss();
    delete this.snackBars[id];
  }

  private addToList(snack) {
    const length = keys(this.snackBars).length;
    this.snackBars[length] = snack;
    return length;
  }
}
