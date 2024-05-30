import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';

import { ClientSpec } from '../../interfaces/client-spec.interface';
import { FormControl } from '@angular/forms';
import { SpecService } from '../../services/spec/spec.service';
import { Subject } from 'rxjs';
import { WindowService } from '../../services/window.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ven-status-dropdown',
  templateUrl: './status-dropdown.component.html',
  styleUrls: ['./status-dropdown.component.scss'],
})
export class StatusDropdownComponent implements OnInit, OnChanges, OnDestroy {
  @Input() spec: ClientSpec;

  @Output() setToPostContract = new EventEmitter();
  @Output() showSnackBar = new EventEmitter();

  options = ['Quote', 'Prepared for contract', 'Completed'];
  fieldControl = new FormControl();
  previousValue: string;
  updatedSucceeded;
  updatedFailed;

  private destroy$ = new Subject();

  constructor(private specService: SpecService, private windowService: WindowService) {}

  ngOnInit(): void {
    this.saveStatus();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.hasOwnProperty('spec') && this.spec.details && this.spec.details.status) {
      this.fieldControl.setValue(this.spec.details.status);
      this.previousValue = this.spec.details.status;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private saveStatus() {
    this.fieldControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (this.previousValue === value || !this.fieldControl) {
        return;
      }

      this.updatedFailed = this.updatedSucceeded = false;
      this.fieldControl.setErrors(null);

      const changesToSave = {
        status: value,
        postContract: value !== 'Quote',
      };

      if (changesToSave.status === 'Prepared for contract') {
        this.setToPostContract.emit({ changesToSave, value, previousValue: this.previousValue });
      } else {
        this.sendRequest(changesToSave, value, this.previousValue);
      }
    });
  }

  private sendRequest(changesToSave, value, previousValue) {
    this.specService.updateStatus(this.spec.uid, changesToSave).subscribe(
      () => {
        this.showSnackBar.emit({ value, previousValue });

        this.previousValue = value;

        this.showFieldSaveSuccessFeedback();
      },
      (error) => {
        console.error(error.message ? error.message : error.toString());
        this.fieldControl.setErrors({ did_not_save: true });
        this.showFieldSaveErrorFeedback();
      }
    );
  }

  private showFieldSaveSuccessFeedback() {
    this.updatedSucceeded = true;
    this.windowService.windowRef.setTimeout(() => (this.updatedSucceeded = false), 1000);
  }

  private showFieldSaveErrorFeedback() {
    this.updatedFailed = true;
    this.windowService.windowRef.setTimeout(() => (this.updatedFailed = false), 1000);
  }
}
