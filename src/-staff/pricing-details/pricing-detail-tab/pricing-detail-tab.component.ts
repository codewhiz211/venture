import { Component, Input, OnInit } from '@angular/core';

import { BaseComponent } from '@shared/components/base.component';
import { CopyPricingComponent } from '../copy-pricing/copy-pricing.component';
import { DialogService } from '@shell/dialogs/dialog.service';
import { PricingService } from '@services/spec/pricing.service';
import { PricingStatus } from '@interfaces/pricing-model.interface';
import { Router } from '@angular/router';
import { ShareService } from '@services/spec/share.service';
import ShareType from '@interfaces/share-type.enum';
import { WindowService } from '@services/window.service';
import { skipWhile } from 'rxjs/operators';

@Component({
  selector: 'app-pricing-detail-tab',
  templateUrl: './pricing-detail-tab.component.html',
  styleUrls: ['./pricing-detail-tab.component.scss'],
})
export class PricingDetailTabComponent extends BaseComponent implements OnInit {
  @Input() data;
  public pricing;
  public client;
  public optionId;
  public status;
  private uid;
  public specUid;
  public editable;

  constructor(
    private dialogService: DialogService,
    private pricingService: PricingService,
    private shareService: ShareService,
    private windowService: WindowService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.pricing = this.data.pricing;
    this.client = this.data.client;
    this.optionId = this.data.optionId;
    this.specUid = this.data.specUid;
    this.status = this.pricing.status;
    this.editable = this.status != PricingStatus.submitted;
    this.uid = this.pricing.uid;
    // As the data only can pass through ven-application-chrome-details-content only once initially,
    // we need to watch pricing to get its latest updating
    this.pricingService.pricingItemUnderSpec$
      .pipe(
        this.takeUntilDestroy(),
        skipWhile((v) => !v)
      )
      .subscribe((pricing) => {
        this.pricing = pricing.find((p) => p.uid == this.uid);
        this.status = this.pricing.status;
        this.editable = this.status != PricingStatus.submitted;
      });
  }

  openInBuild() {
    this.router.navigate(['staff', 'build', this.specUid], { replaceUrl: true });
  }

  copyPricing() {
    this.dialogService.open(CopyPricingComponent, {
      data: {},
      dialogTitle: 'Copy pricing',
    });
  }

  shareSummary() {
    //TODO:share summary
    const shareLink = this.shareService.getShareUrl(this.specUid, this.uid, ShareType.PricingSummary, [], this.optionId);
    this.windowService.windowRef.open(shareLink, '_blank');
  }
}
