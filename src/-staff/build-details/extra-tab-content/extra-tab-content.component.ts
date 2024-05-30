import { Component, Input, OnInit } from '@angular/core';

import { BaseComponent } from '@shared/components/base.component';
import { SpecActiveService } from '@services/spec/spec.active.service';
import { SpecService } from '@services/spec/spec.service';
import { sectionConfig } from '@shared/config/spec-config';

@Component({
  selector: 'app-extra-tab-content',
  templateUrl: './extra-tab-content.component.html',
  styleUrls: ['./extra-tab-content.component.scss'],
})
export class ExtraTabContentComponent extends BaseComponent implements OnInit {
  @Input() data;

  public spec;
  public sections;
  public customValues;

  constructor(private specService: SpecService, private specActiveService: SpecActiveService) {
    super();
  }

  ngOnInit(): void {
    this.spec = this.data.spec;
    this.sections = this.specService.addSectionsFromSpec(this.spec, [...sectionConfig]);
    this.spec.quote.includeGST = this.spec.quote.includeGST || true;
    this.specActiveService.activeSpec$.pipe(this.takeUntilDestroy()).subscribe((spec) => {
      this.initValues(spec);
    });
  }

  private initValues(spec) {
    if (!spec) {
      return;
    }
    this.spec = spec;
    this.sections = this.specService.addSectionsFromSpec(this.spec, [...sectionConfig]);
    this.customValues = this.specService.getCustomOptions();
  }
}
