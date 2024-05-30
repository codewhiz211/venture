import { Component, Input, OnInit } from '@angular/core';

import { PreferenceService } from '@services/preference.service';

@Component({
  selector: 'ven-build-summary-card',
  templateUrl: './build-summary-card.component.html',
  styleUrls: ['./build-summary-card.component.scss'],
})
export class BuildSummaryCardComponent implements OnInit {
  @Input() build;
  @Input() isSaved;

  public chips = [];
  public id;
  constructor(private preference: PreferenceService) {}

  ngOnInit() {
    this.chips = [
      {
        icon: 'notifications',
        label: '2',
      },
      {
        icon: 'place',
        label: this.build.subdivision,
      },
    ];
    this.id = `Lot ${this.build.lot}`;
  }

  handleSaveToggled(isSaved) {
    this.preference.handleSavedItemToggle('specs', this.build.uid, isSaved);
  }
}
