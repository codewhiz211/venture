import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ven-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.scss'],
})
export class CheckboxGroupComponent {
  @Input() groupTitle: string;
  @Input() groupOptions: any[];
  @Input() selectedOptions: any;

  @Output() optionsChanged = new EventEmitter();

  public showMore: boolean = false;

  onOptionChange(any?) {
    if (any) {
      this.selectedOptions = { any: true };
      this.optionsChanged.emit(this.selectedOptions);
    } else {
      this.selectedOptions.any = false;
      let allKeyFalse = true;
      Object.keys(this.selectedOptions).forEach((key) => {
        if (this.selectedOptions[key]) {
          allKeyFalse = false;
        }
      });
      if (allKeyFalse) {
        // if the user has unselected all options, set any to true
        this.selectedOptions = { any: true };
      }
      this.optionsChanged.emit(this.selectedOptions);
    }
  }
}
