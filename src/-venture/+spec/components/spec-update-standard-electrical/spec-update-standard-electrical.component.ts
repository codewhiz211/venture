import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

import { DialogService } from '@shell/dialogs/dialog.service';
import ElectricalPackage from '../electical.package.enum';
import { SpecService } from '@services/spec/spec.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ven-spec-update-standard-electrical',
  templateUrl: './spec-update-standard-electrical.component.html',
  styleUrls: ['./spec-update-standard-electrical.component.scss'],
})
export class SpecUpdateStandardElectricalComponent implements OnInit, OnDestroy {
  @Input() data;

  public selectedPackage: ElectricalPackage;
  public ElectricalPackages = ElectricalPackage;
  public packageList: string[];
  public packagesForm: FormGroup;
  public action: 'packagesList' | 'electricalPackage' = 'packagesList';

  private destroy$ = new Subject();

  public submitAction = {
    label: 'SAVE',
    handler: () => this.onSubmit(),
  };

  public closeAction = {
    label: 'CANCEL',
    handler: () => this.dialogService.closeActiveDialog(),
  };

  constructor(private dialogService: DialogService, private specService: SpecService, private fb: FormBuilder) {}

  ngOnInit() {
    this.selectedPackage = this.data.electricalPackage;
    this.packageList = this.data.packageList;
    this.initForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    const field = {
      hint: false,
      name: this.action,
    };

    if (this.action === 'electricalPackage') {
      if (this.selectedPackage !== this.data.electricalPackage) {
        const changes = { electricalPackage: this.selectedPackage, packageList: null };

        this.specService
          .updateSpec(this.data.spec.uid, this.data.section.name, field, changes)
          .pipe(takeUntil(this.destroy$))
          .subscribe(() => {
            this.dialogService.closeActiveDialog();
          });
      }
    } else {
      this.packagesForm.get('packagesList').value.forEach((item: string, index: number) => {
        if (item.length) {
          this.packageList.splice(index, 1, item);
        }
      });
      const changes = { packageList: this.packageList };

      this.specService
        .updateSpec(this.data.spec.uid, this.data.section.name, field, changes)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.dialogService.closeActiveDialog();
        });
    }
  }

  public handleTabChange(event) {
    this.action = event.index === 0 ? 'packagesList' : 'electricalPackage';
  }

  private initForm() {
    if (this.data.packageList && this.data.packageList.length) {
      this.packagesForm = this.fb.group({
        packagesList: this.fb.array([]),
      });

      this.packageList.forEach(() => {
        (this.packagesForm.get('packagesList') as FormArray).push(new FormControl(''));
      });
    }
  }
}
