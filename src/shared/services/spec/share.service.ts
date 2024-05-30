import { Checklist } from '@interfaces/checklist.data';
import { EmailService } from '../email.service';
import { Injectable } from '@angular/core';
import { LoggerService } from '../logger.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import ShareType from '../../interfaces/share-type.enum';
import { WindowService } from '../window.service';

@Injectable({
  providedIn: 'root',
})
export class ShareService {
  constructor(
    private logger: LoggerService,
    private snackBar: MatSnackBar,
    private emailService: EmailService,
    private windowService: WindowService
  ) {}

  public sendShareEmail(fromAddress, formValues, specId, shareUrl, attachments?) {
    this.snackBar.open(`Sending email to ${formValues.to}`);
    const emailObj: any = {
      to: formValues.to,
      from: fromAddress,
      subject: formValues.subject,
      message: formValues.message,
      specId,
      link: shareUrl,
    };
    if (attachments) {
      emailObj.attachments = attachments;
    }
    this.emailService.sendShareSpecEmail(emailObj).subscribe(
      () => {
        this.logger.debug(`share email url is ${shareUrl}`);
        this.snackBar.open(`Shared by email with ${formValues.to}`, undefined, {
          duration: 2000,
        });
      },
      (error) => {
        console.error(error);
        this.snackBar.open(`Share by email FAILED`);
      }
    );
  }

  public sendShareFiles(fromAddress, formValues, specId, attachments) {
    this.snackBar.open(`Sending email to ${formValues.to}`);
    const emailObj: any = {
      to: formValues.to,
      from: fromAddress,
      subject: formValues.subject,
      message: formValues.message,
      specId,
    };
    if (attachments) {
      emailObj.attachments = attachments;
    }
    this.emailService.sendShareFilesEmail(emailObj).subscribe(
      () => {
        this.snackBar.open(`Shared by email with ${formValues.to}`, undefined, {
          duration: 2000,
        });
      },
      (error) => {
        console.error(error);
        this.snackBar.open(`Share by email FAILED`);
      }
    );
  }

  /**
   * Returns a URL that can be used to share a spec / checklist(s)
   * See: getShareCode() below
   *
   * @param specId
   * @param snapId
   * @param shareType
   * @param checklistsArr - Array of checklists (TODO to ids?)
   */
  public getShareUrl(specId: string, snapId: string | number, shareType: ShareType, checklistsArr?: Checklist[], optionId?: string) {
    const shareCode = this.getShareCode(specId, snapId, shareType, checklistsArr, optionId);
    return `${this.windowService.windowRef.location.origin}/public/share/${shareCode}`;
  }

  /**
   * Returns the share code used in URLs to share a spec / checklist(s)
   *
   * The share param consists of 5 sections:
   * 1 Spec, 2 Extras, 3 Quote, 4 Checklist, 5 Ids of checklists to display
   * 1 through 4 are all one letter. Uppercase letters are TRUE and should be display, lowercase are FALSE and should not be displayed.
   * Section 5 consists of one or more checklist id.
   * Any uppercase letter is TRUE, lowercase is FALSE.
   *
   * NOTE: previously we allowed the user to share multiple things at once, now they can only share one item.
   * For backwards compatibility we will keep the same URL structure though.
   */
  private getShareCode(specId: string, snapId: string | number, shareType: ShareType, checklistsArr?: Checklist[], optionId?: string) {
    const printSpec = this.getTrueFalse([ShareType.Spec, ShareType.ExtrasAndSpec, ShareType.QuoteAndSpec].includes(shareType));
    const printExtras = this.getTrueFalse(shareType === ShareType.Extras || shareType === ShareType.ExtrasAndSpec);
    const printQuote = this.getTrueFalse(shareType === ShareType.Quote || shareType === ShareType.QuoteAndSpec);
    const printFiles = this.getTrueFalse(shareType === ShareType.Files);
    const printChecklists = this.getTrueFalse(shareType === ShareType.Checklists);
    const printPricingSummary = this.getTrueFalse(shareType === ShareType.PricingSummary);

    this.logger.debug(`share spec of type ${shareType} for ${specId}/${snapId}`);

    let checklistsToShare = '';
    if (printChecklists && checklistsArr) {
      this.logger.debug(`and checklists of ${checklistsArr}`);
      checklistsToShare = checklistsArr.map((cl) => cl.id.toString(16)).join('');
    }

    if (shareType === ShareType.Checklists) {
      // when we share checklists it is never a snapshot
      return `${printSpec}${printExtras}${printQuote}${printChecklists}${printPricingSummary}${checklistsToShare}/${specId}`;
    } else if (shareType === ShareType.PricingSummary) {
      // for pricing summary sharing, we set snapId with pricingUid.
      return `${printSpec}${printExtras}${printQuote}${printChecklists}${printPricingSummary}${checklistsToShare}/${specId}/${snapId}/${optionId}`;
    } else {
      return `${printSpec}${printExtras}${printQuote}${printChecklists}${printPricingSummary}${checklistsToShare}/${specId}/${snapId}`;
    }
  }

  public decodeShareCode(shareCode: string) {
    // TODO we now only share one thing at a time so this can be simplified
    // the share param consists of 5 sections:
    // 1 Spec, 2 Extras, 3 Quote, 4 Checklist, 5 Ids of checklists to display
    // 1 through 4 are all one letter. Uppercase letters are TRUE and should be display, lowercase are FALSE and should not be displayed.
    // Section 5 consists of one or more checklist id.
    return {
      printSpec: shareCode && shareCode[0] === shareCode[0].toUpperCase(),
      printExtras: shareCode && shareCode[1] === shareCode[1].toUpperCase(),
      printQuote: shareCode && shareCode[2] === shareCode[2].toUpperCase(),
      printChecklists: shareCode && shareCode[3] === shareCode[3].toUpperCase(),
      printPricingSummary: shareCode && shareCode[4] === shareCode[4].toUpperCase(),
    };
  }

  public convertCheckListParamsToIds(params: any[]) {
    return params.map((cId) => parseInt(cId, 16));
  }

  private getTrueFalse(flag) {
    const truthy = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const falsey = 'abcdefghijklmnopqrstuvwxyz';
    return flag ? truthy.charAt(Math.floor(Math.random() * truthy.length)) : falsey.charAt(Math.floor(Math.random() * falsey.length));
  }
}
