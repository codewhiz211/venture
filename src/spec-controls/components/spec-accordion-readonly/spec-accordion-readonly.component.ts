import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ScrollToConfigOptions, ScrollToService } from '@nicky-lenaers/ngx-scroll-to';

import { ClientSpec } from '@interfaces/client-spec.interface';
import { ExtrasService } from '@services/spec/extras.service';
import { MatAccordion } from '@angular/material/expansion';
import { SectionConfig } from 'src/-venture/+spec/components/section-config.interface';
import { SpecActiveService } from '@services/spec/spec.active.service';
import { SpecFormatterService } from '@services/spec/spec.formatter.service';
import { Subject } from 'rxjs';
import { WindowService } from '@services/window.service';
import { sectionConfig } from '@shared/config/spec-config';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ven-spec-accordion-readonly',
  templateUrl: './spec-accordion-readonly.component.html',
  styleUrls: ['./spec-accordion-readonly.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpecAccordionReadonlyComponent implements OnInit, OnDestroy {
  // spec: is the saved spec content
  // sections: is the config for the spec (what fields to include and where)
  // activeSection: the section (id) that is currently expanded
  @Input() spec: ClientSpec;
  @Input() sections: SectionConfig[] = [];

  @ViewChild('myaccordion', { static: true }) myPanels: MatAccordion;

  public isMobile = false;
  public openAll = false;
  public extras: [];
  public todaysDate = Date.now();
  public activeSection: number;

  private destroy$ = new Subject<any>();

  constructor(
    private specActiveService: SpecActiveService,
    private windowService: WindowService,
    private extrasService: ExtrasService,
    private chgDRef: ChangeDetectorRef
  ) {
    this.isMobile = this.windowService.isMobile;
  }

  ngOnInit(): void {
    //close any section opened last time. If we put in onDestory, the out animation can not work
    this.specActiveService.closeSection();
    this.specActiveService.activeSection$.pipe(takeUntil(this.destroy$)).subscribe((activeSection) => {
      this.activeSection = activeSection;
      this.chgDRef.markForCheck();
      this.chgDRef.detectChanges();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes['spec']) {
      const spec = changes['spec'].currentValue;

      if (spec) {
        this.extras = this.getExtras(spec);
      }
    }
  }

  private getExtras(spec) {
    let extras;
    // if share SPEC ONLY - show optional extras in spec
    extras = this.extrasService.getAllExtraSections(spec);
    if (extras['electrical']) {
      const validOptionalExtras = extras['electrical'].extras.filter((e) => e.optional).map((e) => ({ ...e, amount: 0 }));
      if (validOptionalExtras.length > 0) {
        extras['electrical_optional'] = validOptionalExtras;
      }
    }

    return extras;
  }

  setStep(sectionId: number) {
    this.specActiveService.openSection(sectionId);
  }

  trackSectionChange(index) {
    return index;
  }

  ngOnDestroy(): void {
    this.specActiveService.closeSectionAction();
    this.destroy$.next();
    this.destroy$.complete();
  }

  afterCollapse(sectionId) {
    if (this.activeSection === sectionId) {
      this.activeSection = -1;
      this.myPanels.closeAll();
      this.scrollToMe(0);
    }
  }

  scrollToMe(sectionId) {
    const targetElem = this.windowService.windowRef.document.getElementById(`section_${sectionId}`);
    targetElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
