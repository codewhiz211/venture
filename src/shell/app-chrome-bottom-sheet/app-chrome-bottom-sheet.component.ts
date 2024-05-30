import { Component, Input, OnInit } from '@angular/core';

export interface AppChromeBottomSheetConfig {
  close: (any: any) => void;
  title: string;
}

@Component({
  selector: 'ven-app-chrome-bottom-sheet',
  templateUrl: './app-chrome-bottom-sheet.component.html',
  styleUrls: ['./app-chrome-bottom-sheet.component.scss'],
})
export class AppChromeBottomSheet implements OnInit {
  @Input() config: AppChromeBottomSheetConfig;

  public title: string;

  ngOnInit(): void {
    this.title = this.config.title;
  }

  onCloseClick(e) {
    this.config.close(e);
  }
}
