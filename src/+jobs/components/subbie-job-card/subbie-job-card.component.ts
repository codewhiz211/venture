import { Component, Input } from '@angular/core';

import { JobContent } from '@interfaces/job-content.enum';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

@Component({
  selector: 'ven-subbie-job-card',
  templateUrl: './subbie-job-card.component.html',
  styleUrls: ['./subbie-job-card.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class SubbieJobCardComponent {
  @Input() specUid;
  @Input() subbieUid;
  @Input() jobs; //{job,key}
  @Input() jobTitle;
  @Input() isRemedial;

  public content = JobContent.admin;
}
