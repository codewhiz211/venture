import { Component } from '@angular/core';
import { DevService } from './dev.service';
import { SnackBarService } from '@services/snackbar.service';

@Component({
  selector: 'ven-dev-tab',
  templateUrl: './dev-tab.component.html',
  styleUrls: ['./dev-tab.component.scss'],
})
export class DevTabComponent {
  constructor(private devService: DevService, private snackbarService: SnackBarService) {}

  public onClearAnonUsers() {
    this.devService.clearAnonUsers().subscribe(() => this.snackbarService.open('Cleared!'));
  }
}
