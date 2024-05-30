import { BehaviorSubject, forkJoin, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { AuthService } from '@auth/services/auth.service';
import { BaseDbService } from '@services/base.db.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PricingStatus } from '@interfaces/pricing-model.interface';
import { SpecService } from './spec.service';
import { clone } from 'ramda';

@Injectable({
  providedIn: 'root',
})

//handling pricing flow
export class PricingService extends BaseDbService {
  private currentSpecUid;

  //TODO pricing interface
  private _pricingItems: BehaviorSubject<any> = new BehaviorSubject(undefined);
  public readonly pricingItems$ = this._pricingItems.asObservable();
  private _pricingItemUnderSpec: BehaviorSubject<any> = new BehaviorSubject(undefined);
  public readonly pricingItemUnderSpec$ = this._pricingItemUnderSpec.asObservable();
  //Option summary is only added to DB when submit summary is triggered.

  constructor(private authService: AuthService, private http: HttpClient, private specService: SpecService, private snackBar: MatSnackBar) {
    super();
  }

  get pricing() {
    return this._pricingItemUnderSpec.getValue();
  }

  getPricingOption(specUid, pricingUid) {
    const pricingItems = this._pricingItemUnderSpec.getValue();
    if (pricingItems && specUid == this.currentSpecUid) {
      return this._pricingItemUnderSpec.pipe(
        map((pricingItems) => {
          return pricingItems.find((p) => p.uid == pricingUid);
        })
      );
    } else {
      return this.http.get(`/pricing/${specUid}/${pricingUid}`).pipe(
        map((p) => {
          return { ...p, uid: pricingUid };
        })
      );
    }
  }

  requestPricing(request, specUid, addedStatus) {
    const user = {
      userName: this.authService.authUser.name,
      userEmail: this.authService.authUser.email,
    };
    const requestDate = Date.now();

    //create an item with request,user email/name,dataTime in pricing/specid
    //create an item {amount:pending,display:value,field:field,item:value,postContract:spec.details.postcontract} in spec/extras_manual
    //We take most of addManualExtra of specService here
    return this.http.post(`/pricing/${specUid}`, { ...request, ...user, requestDate, status: PricingStatus.requested }).pipe(
      switchMap((result: any) => {
        const extra = {
          amount: 'pending',
          display: request.details,
          field: request.field,
          addedStatus,
          pricingUid: result.name,
        };
        return this.specService.addManualExtra(request.section, extra);
      })
    );
  }

  submitPricing(pricing, specUid, pricingUid) {
    //get price with precision of 2
    const updatedPricing = { ...pricing, status: PricingStatus.submitted };
    //TODO: add pricing to extra
    return this.updatePricingToDB(updatedPricing, pricingUid, specUid).pipe(
      map((result) => {
        const pricingItems = clone(this.pricing);
        const index = pricingItems.findIndex((p) => p.uid == pricingUid);
        pricingItems[index] = { ...pricingItems[index], ...updatedPricing };
        this._pricingItemUnderSpec.next(pricingItems);
        return result;
      })
    );
  }

  getAllPricingItem() {
    this.http.get('/pricing').subscribe((pricingItems) => {
      this._pricingItems.next(pricingItems);
    });
  }

  getPricingItemUnderSpec(specUid, refresh) {
    const pricingItem = this._pricingItems.getValue();
    this.currentSpecUid = specUid;
    if (pricingItem && !refresh) {
      this._pricingItemUnderSpec.next(this.addKeys(pricingItem[specUid]));
    } else {
      this.http.get(`/pricing/${specUid}`).subscribe((pricingItems) => {
        this._pricingItemUnderSpec.next(this.addKeys(pricingItems));
      });
    }
  }

  clearPricingItemUnderSpec() {
    this._pricingItemUnderSpec.next(undefined);
  }

  updatePricing(uid, data, action = undefined, section = undefined) {
    const pricing = clone(this.pricing);
    const index = pricing.findIndex((p) => p.uid == uid);
    const summary = this.getSummary(pricing[index]);
    pricing[index] = section ? { ...pricing[index], [section]: data } : data;
    if (pricing[index].status == PricingStatus.requested) {
      pricing[index].status = PricingStatus.draft;
    }
    pricing[index].price = summary.totalOptionPrice;
    this.updatePricingToDB(pricing[index], uid, this.currentSpecUid).subscribe(() => {
      // TODO, this would be better handled in the component since that is the UI layer.
      if (action) {
        const defaultMessages = {
          Add: 'New row has been added',
          Delete: 'Row has been deleted',
          Edit: 'Row has been updated',
          UpdateAdminFee: 'Admin fee has been updated',
        };
        this.snackBar.open(defaultMessages[action]);
      }
    });
    this._pricingItemUnderSpec.next(pricing);
  }

  updatePricingToDB(pricing, pricingUid, specUid) {
    return this.http.patch(`/pricing/${specUid}/${pricingUid}`, pricing);
  }

  public getSummary(p) {
    const pngTotal = this.sum(p.png?.items);
    const extrasLabourTotal = this.sum(p.extras?.items.Labour);
    const extrasMaterialsTotal = this.sum(p.extras?.items.Materials);
    const extrasQuotesTotal = this.sum(p.extras?.items.Quotes);
    const extraTotal = extrasLabourTotal + extrasMaterialsTotal + extrasQuotesTotal;
    const creditsLabourTotal = this.sum(p.credits?.items.Labour);
    const creditsMaterialsTotal = this.sum(p.credits?.items.Materials);
    const creditsQuotesTotal = this.sum(p.credits?.items.Quotes);
    const creditTotal = creditsLabourTotal + creditsMaterialsTotal + creditsQuotesTotal;
    let total = pngTotal + extraTotal - creditTotal;
    total = total >= 0 ? total : 0; // to avoid total less than 0
    const admin =
      total == 0
        ? 0
        : pngTotal * this.getAdminFee(p.png?.adminFee) +
          extraTotal * this.getAdminFee(p.extras?.adminFee) -
          creditTotal * this.getAdminFee(p.credits?.adminFee);
    const subtotal = total + admin;
    return {
      png: { png: pngTotal, total: pngTotal },
      extras: {
        labour: extrasLabourTotal,
        materials: extrasMaterialsTotal,
        quotes: extrasQuotesTotal,
        total: extraTotal, // total is only used as a flag of showing the section
      },
      credits: {
        labour: creditsLabourTotal,
        materials: creditsMaterialsTotal,
        quotes: creditsQuotesTotal,
        total: creditTotal,
      },
      total, //raw total
      admin,
      subtotal,
      gst: subtotal * 0.15,
      totalOptionPrice: Math.round(subtotal * 1.15 * 100) / 100, // the final result price
      uid: p.uid,
    };
  }

  public getAdminFee(adminFee) {
    return adminFee == undefined ? 0.05 : adminFee;
  }

  private sum(rows) {
    if (!rows) {
      return 0;
    }
    return rows.reduce((total, row) => total + row.total, 0);
  }
}
