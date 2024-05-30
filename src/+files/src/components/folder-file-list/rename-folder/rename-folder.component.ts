import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'ven-rename-folder',
  templateUrl: './rename-folder.component.html',
  styleUrls: ['./rename-folder.component.scss'],
})
export class RenameFolderComponent implements OnChanges {
  @Input() name: string;
  @Output() folderChanged = new EventEmitter();

  public changingName: boolean = false;
  public newFolderName;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['name']) {
      this.changingName = false;
      this.newFolderName = new FormControl(changes['name'].currentValue, [Validators.required]);
    }
  }

  getErrorMessage() {
    return this.newFolderName.hasError('required') ? 'You must enter a value' : '';
  }

  onKeydown(event) {
    if (event.key === 'Enter') {
      this.save();
    }
  }

  save() {
    if (this.newFolderName.invalid) {
      return;
    }
    if (this.newFolderName.value) {
      this.changingName = true;
      this.folderChanged.emit(this.newFolderName.value);
    }
  }
}
