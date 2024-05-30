import { Component, Input, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { BaseComponent } from '@shared/components/base.component';
import { ClientSpec } from '@interfaces/client-spec.interface';
import { DialogService } from '../../../shell/dialogs/dialog.service';
import { Observable } from 'rxjs';
import { SectionConfig } from 'src/-venture/+spec/components/section-config.interface';
import { SpecActiveService } from '@services/spec/spec.active.service';
import { SpecFormatterService } from '@services/spec/spec.formatter.service';
import { SpecService } from '@services/spec/spec.service';
import { UserType } from '@auth/roles';
import { map } from 'rxjs/operators';
import { sectionConfig } from '@shared/config/spec-config';

@Component({
  selector: 'ven-spec-tab-content',
  templateUrl: './spec-tab-content.component.html',
  styleUrls: ['./spec-tab-content.component.scss'],
})
export class SpecTabContentComponent extends BaseComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private specService: SpecService,
    private specActiveService: SpecActiveService,
    private specFormatterService: SpecFormatterService,
    private dialogService: DialogService,
    private authService: AuthService
  ) {
    super();
    this.isStaffView = this.authService.authUser.type === UserType.Staff;
  }

  @Input() data;

  public editing$: Observable<boolean>;
  public sections$: Observable<SectionConfig[]>;
  public spec$: Observable<ClientSpec>;

  public status: string;

  public isStaffView: boolean = false;

  public customValues;

  ngOnInit(): void {
    this.spec$ = this.specActiveService.activeSpec$.pipe(this.takeUntilDestroy());

    this.editing$ = this.spec$.pipe(
      this.takeUntilDestroy(),
      map((spec) => this.initValue(spec))
    );

    this.sections$ = this.spec$.pipe(
      this.takeUntilDestroy(),
      map((spec) => this.getSections(spec))
    );
  }
  private initValue(spec) {
    this.status = spec?.details.status;
    if (this.isStaffView) {
      this.customValues = this.specService.getCustomOptions();
    }
    return !spec?.disabled;
  }

  private getSections(spec: ClientSpec) {
    if (!spec) {
      return [];
    }

    const allSections = this.specFormatterService.combineUserAndDefinedSections(spec, sectionConfig);

    // whole section is hidden if { sectionName: true}
    // subsection is hidden if { sectionName: { subSectionName: true }}
    return allSections.filter((section) => {
      if (!spec) {
        return false;
      }
      if (spec.hiddenSections[section.name] === true) {
        return false;
      }
      return true;
    });
  }
}
