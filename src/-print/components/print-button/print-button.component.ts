import { Component, OnInit } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
import { PrintChromeDialogComponent } from '../print-chrome-dialog/print-chrome-dialog.component';
import { WindowService } from '@services/window.service';

@Component({
  selector: 'ven-print-button',
  templateUrl: './print-button.component.html',
  styleUrls: ['./print-button.component.scss'],
})
export class PrintButtonComponent implements OnInit {
  constructor(private windowService: WindowService, private dialog: MatDialog) {}

  ngOnInit(): void {}

  public print() {
    if (this.windowService.isChrome()) {
      this.windowService.windowRef.print();
    } else {
      // if not on chrome show a dialog first
      const dialogRef = this.dialog.open(PrintChromeDialogComponent, {
        panelClass: 'full-width-dialog',
        width: this.windowService.isMobile ? '100%' : '50%',
        data: {
          link: this.windowService.windowRef.location.href,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.windowService.windowRef.print();
        }
      });
    }
  }
}
