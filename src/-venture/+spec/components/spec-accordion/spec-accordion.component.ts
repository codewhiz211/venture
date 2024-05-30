import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ScrollToConfigOptions, ScrollToService } from '@nicky-lenaers/ngx-scroll-to';

import { ClientSpec } from '@interfaces/client-spec.interface';
import { ConfirmationDialogComponent } from '@shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { DialogService } from '@shell/dialogs/dialog.service';
import { MatAccordion } from '@angular/material/expansion';
import { MatDialog } from '@angular/material/dialog';
import { SectionConfig } from '../section-config.interface';
import { SpecActiveService } from '@services/spec/spec.active.service';
import { SpecService } from '@services/spec/spec.service';
import { Subject } from 'rxjs';
import { WindowService } from '@services/window.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ven-spec-accordion',
  templateUrl: './spec-accordion.component.html',
  styleUrls: ['./spec-accordion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpecAccordionComponent implements OnInit, OnDestroy {
  // spec: is the saved spec content
  // sections: is the config for the spec (what fields to include and where)
  // activeSection: the section (id) that is currently expanded
  @Input() spec: ClientSpec;
  @Input() sections: SectionConfig[] = [];

  @ViewChild('myaccordion', { static: true }) myPanels: MatAccordion;

  public isMobile = false;
  public openAll = false;
  public todaysDate = Date.now();
  public activeSection: number;

  private destroy$ = new Subject<any>();

  constructor(
    private scrollToService: ScrollToService,
    private specService: SpecService,
    private activeSpecService: SpecActiveService,
    private windowService: WindowService,
    private dialogService: DialogService,
    private chgDRef: ChangeDetectorRef
  ) {
    this.isMobile = this.windowService.isMobile;
  }

  ngOnInit(): void {
    this.activeSpecService.activeSection$.pipe(takeUntil(this.destroy$)).subscribe((activeSection) => {
      this.activeSection = activeSection;
      this.chgDRef.markForCheck();
      this.chgDRef.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setStep(sectionId: number) {
    this.activeSpecService.openSection(sectionId);
  }

  hideSection(sectionName: string) {
    this.spec.hiddenSections[sectionName] = true;
    this.specService.hideSection(this.spec.uid, sectionName).subscribe();
  }

  showSection(sectionName: string) {
    this.spec.hiddenSections[sectionName] = false;
    this.specService.showSection(this.spec.uid, sectionName).subscribe();
  }

  afterCollapse(sectionId) {
    if (this.activeSection === sectionId) {
      this.activeSection = 0;
    }
  }

  scrollToMe(sectionId) {
    const config: ScrollToConfigOptions = {
      target: `section_${sectionId}`,
      duration: 1500,
      easing: 'easeOutElastic',
    };

    if (this.windowService.windowRef.innerWidth < 600) {
      // use manual scroll for mobile as _scrollToService not working well
      const targetElem = this.windowService.windowRef.document.getElementById(`section_${sectionId}`);
      this.windowService.windowRef.scrollTo(0, targetElem.offsetTop + 90);
    } else {
      // https://github.com/nicky-lenaers/ngx-scroll-to
      this.scrollToService.scrollTo(config);
    }
  }

  deleteSection(section) {
    const message = `This will permanently delete the ${section.title} section from the spec and cannot be undone.
    If you might want this section in the future, consider hiding the section instead`;
    this.dialogService
      .open(ConfirmationDialogComponent, {
        data: {
          html: message,
        },
        dialogTitle: 'Are you sure?',
      })
      .subscribe((result) => {
        if (result) {
          this.specService.deleteCustomSection(this.spec.uid, section.name).subscribe();
        }
      });
  }

  trackSectionChange(index) {
    return index;
  }

  showSubSection(sectionName: string, subSection: string) {
    this.specService.showSubSection(this.spec.uid, sectionName, subSection).subscribe();
  }
}
