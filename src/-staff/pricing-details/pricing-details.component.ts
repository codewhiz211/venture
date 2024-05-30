import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { AppChromeDetailsPageFooterConfig } from '@shell/app-chrome-details-page-footer/app-chrome-details-page-footer.component';
import COLOURS from '@styles/colours';
import { ClientService } from '@clients/services/client.service';
import { CopyPricingComponent } from './copy-pricing/copy-pricing.component';
import { DialogService } from '@shell/dialogs/dialog.service';
import { HeaderMenuService } from '@shell/header-menu.service';
import { NoteService } from '../services/note.service';
import { PreferenceService } from '@services/preference.service';
import { PricingDetailTabComponent } from './pricing-detail-tab/pricing-detail-tab.component';
import { PricingService } from '@services/spec/pricing.service';
import { PricingStatus } from '@interfaces/pricing-model.interface';
import { PricingSummaryBoardComponent } from './pricing-summary-board/pricing-summary-board.component';
import { ShareService } from '@services/spec/share.service';
import ShareType from '@interfaces/share-type.enum';
import { SubmitPricingComponent } from './submit-pricing/submit-pricing.component';
import { WindowService } from '@services/window.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'ven-pricing-details',
  templateUrl: './pricing-details.component.html',
  styleUrls: ['./pricing-details.component.scss'],
})
export class PricingDetailsComponent implements OnInit, OnDestroy {
  public headerConfig;
  public contentConfig;
  public footerConfig: AppChromeDetailsPageFooterConfig;
  public currentTab;

  private pricingItemUnderSpec = undefined;

  private isDesktop;
  private specUid;

  constructor(
    private preference: PreferenceService,
    private pricingService: PricingService,
    private windowService: WindowService,
    private clientService: ClientService,
    private dialogService: DialogService,
    private route: ActivatedRoute,
    private menuService: HeaderMenuService,
    private noteService: NoteService,
    private shareService: ShareService,
    private router: Router
  ) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.menuService.addMenuItem({
        icon: 'library_books',
        label: 'Note library',
        method: () => this.router.navigate(['staff', 'note-library']),
        order: 0,
      });
    }, 0);
    this.specUid = this.route.snapshot.paramMap.get('specUid');
    combineLatest([this.clientService.getClientInfo(this.specUid), this.pricingService.pricingItemUnderSpec$]).subscribe(
      ([clientInfo, pricingItemUnderSpec]) => {
        if (!clientInfo || !pricingItemUnderSpec) {
          return;
        }
        this.headerConfig = this.getHeaderConfig(clientInfo);
        if (!this.pricingItemUnderSpec) {
          // only load content once if not the tab will fail to load. The same as the job-details in subbie App
          this.contentConfig = this.getContentConfig(pricingItemUnderSpec, clientInfo);
          this.pricingItemUnderSpec = pricingItemUnderSpec;
        }
        this.footerConfig = this.getFooterConfig(pricingItemUnderSpec);
      }
    );
    this.pricingService.getPricingItemUnderSpec(this.specUid, true);
    //load notes for pricing-note-choossing dialog
    this.noteService.getNotes();
  }

  ngOnDestroy(): void {
    //to avoid the last pricingItem loaded in the new opened details page
    this.pricingService.clearPricingItemUnderSpec();
    this.menuService.removeMenuItem('Note library');
  }

  private getHeaderConfig(client) {
    if (!client) {
      return {};
    }
    const isSaved = this.preference.savedPricing?.[this.specUid];
    this.isDesktop = this.windowService.isDesktop;
    const savedColour = this.isDesktop ? COLOURS.white : COLOURS.bluePrimary;
    const nonSavedColour = this.isDesktop ? COLOURS.white : 'gray';

    return {
      title: client.lot,
      barActions: [
        {
          icon: 'star',
          label: 'Favourite',
          action: () => this.handleSavedToggled(this.specUid, !(isSaved || false)),
          colours: { true: savedColour, false: nonSavedColour },
          filled: isSaved || false,
        },
      ],
      menuActions: [],
    };
  }

  private getContentConfig(pricingItems, client) {
    const detailTab = pricingItems.map((pricing, i) => {
      //we don't keep Option+number in our firebase, as the firebase post API updates item
      //like javascript push() and their ids are in order of requestDate. So we just need
      // to generate id here.
      const optionId = i + 1;
      return {
        label: `OPTION ${optionId}`,
        id: `option${optionId}`,
        component: PricingDetailTabComponent,
        data: { pricing, client, optionId, specUid: this.specUid },
      };
    });
    return [
      {
        label: 'SUMMARY',
        id: 'summary',
        component: PricingSummaryBoardComponent,
        data: {
          specUid: this.specUid,
          handleTabChange: (tabId) => this.changedTab(tabId),
        },
      },
      ...detailTab,
    ];
  }

  private getFooterConfig(pricingItem): AppChromeDetailsPageFooterConfig {
    const optionItem = pricingItem.map((item, i) => {
      return `option${i + 1}`;
    });
    const pricingUidMap = {};
    pricingItem.forEach((item, i) => {
      pricingUidMap[`option${i + 1}`] = item.uid;
    });
    const editableOptionItem = optionItem.filter((item, i) => pricingItem[i].status != PricingStatus.submitted);
    return {
      type: 'mix',
      actions: [
        {
          icon: 'handyman',
          label: () => 'Open in Builds',
          action: () => this.openInBuilds(),
          tabs: optionItem,
        },
        {
          icon: 'content_copy',
          label: () => 'Copy pricing',
          action: () => this.copyPricing(),
          tabs: editableOptionItem,
        },
        {
          icon: 'share',
          label: () => 'Share summary',
          action: () => this.shareSummary(pricingUidMap[this.currentTab], this.getCurrentOptionId()),
          tabs: optionItem,
        },
        {
          icon: 'check_circle',
          label: () => 'Submit pricing',
          primary: true,
          action: () => this.submitPricing(pricingUidMap[this.currentTab], this.getCurrentOptionId()),
          shownOnDesktop: true,
          tabs: editableOptionItem,
        },
      ],
    };
  }

  handleSavedToggled(specUid, isSaved) {
    this.preference.handleSavedItemToggle('pricing', specUid, isSaved);
  }

  changedTab(tabId) {
    this.currentTab = tabId;
  }

  submitPricing(pricingUid, optionId) {
    this.dialogService.open(SubmitPricingComponent, {
      data: { pricingUid, optionId, specUid: this.specUid },
      dialogTitle: 'Submit pricing',
    });
  }

  private getCurrentOptionId() {
    return this.currentTab.replace('option', '');
  }

  openInBuilds() {
    this.router.navigate(['staff', 'build', this.specUid], { replaceUrl: true });
  }

  copyPricing() {
    this.dialogService.open(CopyPricingComponent, {
      data: {},
      dialogTitle: 'Copy pricing',
    });
  }

  shareSummary(pricingUid, optionId) {
    const shareLink = this.shareService.getShareUrl(this.specUid, pricingUid, ShareType.PricingSummary, [], optionId);
    this.windowService.windowRef.open(shareLink, '_blank');
  }
}
