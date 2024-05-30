import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { DialogService, DialogSize } from '@shell/dialogs/dialog.service';
import { packages, packagesV3 } from '@shared/config/spec-config/package-list';

import { ClientSpec } from '@interfaces/client-spec.interface';
import { DrawerContent } from '@shell/drawer/drawer-content.type';
import { DrawerService } from '@shell/drawer/drawer.service';
import ElectricalPackage from 'src/-venture/+spec/components/electical.package.enum';
import { SectionConfig } from 'src/-venture/+spec/components/section-config.interface';
import { SpecUpdateStandardElectricalComponent } from 'src/-venture/+spec/components/spec-update-standard-electrical/spec-update-standard-electrical.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ven-electrical-package',
  templateUrl: './electrical-package.component.html',
  styleUrls: ['./electrical-package.component.scss'],
})
export class ElectricalPackageComponent implements OnChanges, OnDestroy {
  @Input() houseSize: number;
  @Input() spec: ClientSpec;
  @Input() section: SectionConfig;
  @Input() manualPackage: number;
  @Input() print: boolean;

  public package: ElectricalPackage = ElectricalPackage.None;
  public ElectricalPackages = ElectricalPackage;
  public packages = [];

  private destroy$ = new Subject();
  constructor(private dialogService: DialogService) {}

  ngOnChanges() {
    this.setPackage();
  }

  ngOnDestroy() {
    this.packages = [];
    this.destroy$.next();
    this.destroy$.complete();
  }

  editStandardPackage(): void {
    if (this.spec.disabled) {
      return;
    }
    const electricalPackage =
      this.manualPackage || this.manualPackage === ElectricalPackage.None ? this.manualPackage : this.choosePackage(this.houseSize);

    this.dialogService
      .open(SpecUpdateStandardElectricalComponent, {
        data: {
          spec: this.spec,
          section: this.section,
          electricalPackage,
          packageList: this.packages,
        },
        dialogTitle: 'Edit Electrical Standard Package',
        size: DialogSize.Large,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  private setPackage(): void {
    this.package =
      this.manualPackage || this.manualPackage === ElectricalPackage.None ? this.manualPackage : this.choosePackage(this.houseSize);

    //@ts-ignore
    this.packages = this.spec[this.section.name]['packageList'] || [...this.setPackageList(this.package)];
  }

  private choosePackage(houseSize) {
    if (houseSize >= 80 && houseSize < 130) {
      return ElectricalPackage.StandardSmall;
    } else if (houseSize >= 130 && houseSize < 170) {
      return ElectricalPackage.StandardMedium;
    } else if (houseSize >= 170 && houseSize < 200) {
      return ElectricalPackage.StandardLarge;
    } else if (houseSize < 80) {
      return ElectricalPackage.POASmall;
    } else if (houseSize >= 200) {
      return ElectricalPackage.POALarge;
    } else {
      return ElectricalPackage.PleaseEnterHouseSize;
    }
  }

  private setPackageList(packageType: number) {
    const p = this.spec.details.specVersion >= 3 ? packagesV3 : packages;
    if (packageType === ElectricalPackage.StandardSmall) {
      return p.standardSmall;
    } else if (packageType === ElectricalPackage.StandardMedium) {
      return p.standardMedium;
    } else if (packageType === ElectricalPackage.StandardLarge) {
      return p.standardLarge;
    } else {
      return [];
    }
  }
}
