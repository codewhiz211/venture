import { GstService } from './gst.service';
import { Injectable } from '@angular/core';

/*
GST is 15%, but it is 15% of the ‘excl.GST’ figure, not 15% of the ‘incl.GST’ figure. Since in the app the users only supply the ‘incl.GST’ figure we cannot calculate the GST this way.
To correctly calculate the ‘GST’ and ‘excl.GST’ figures based on the user inputed ‘incl.GST’ figure, the logic should be as follows:

Step 1:
Calculate the excl.GST amount
excl.GST = incl.GST / 1.15

Step 2:
Calculate the GST amount
GST = incl.GST - excl.GST
*/

@Injectable({
  providedIn: 'root',
})
export class QuoteService {
  constructor(private gstService: GstService) {}
  /**
   * Sum the provided array of extras. Accounts for the amount sometimes being a string
   * @param extras a list of extras; objects having an amount property
   * @param includeGST - if true exclude GST
   */
  public sumExtrasArray(extras, includeGST?) {
    const gst = includeGST === undefined ? true : includeGST;
    return extras.reduce((total, extra) => {
      return extra.amount == 'pending'
        ? total
        : total + (gst ? this.gstService.getGross(extra.amount) : this.gstService.getNet(extra.amount));
    }, 0);
  }

  /**
   * Get quote totals, including full gst breakdown.
   * @param paymentMethod - the payment method as entered by user
   * @param landPrice - gross land price as entered by user
   * @param buildPrice - gross build price as entered by user
   * @param initialCommitment - gross initial commitment as entered by user
   * @param turnKeyFee - turn Key Fee if preset (by user)
   * @param autoCalcTurnkey - if the turn key fee is calculated or preset
   * @param extrasList - a list of all extras added by the user (pre)
   */
  public getQuote(paymentMethod, landPrice, buildPrice, initialCommitment, turnKeyFee, autoCalcTurnkey, specVersion, extrasList) {
    const quote = {
      build: {},
      totalBuild: { gross: 0, net: 0, gst: 0 },
      land: {},
      commitment: {},
      turnKey: {},
      extrasList: [],
      gross: 0,
      net: 0,
      gst: 0,
    };
    extrasList.forEach((extra) => {
      const breakdown = this.gstService.getBreakdown(extra.amount);
      extra.gross = breakdown.gross;
      extra.net = breakdown.net;
      extra.gst = breakdown.gst;
    });
    const extrasGross = extrasList.reduce((total, extra) => {
      return total + extra.gross;
    }, 0);

    const totalBuildPrice = extrasGross + buildPrice;

    const build = this.gstService.getBreakdown(buildPrice);
    const land = this.gstService.getBreakdown(landPrice);
    const commitment = this.gstService.getBreakdown(initialCommitment);
    const extras = this.gstService.getBreakdown(extrasGross);
    const totalBuild = this.gstService.getBreakdown(totalBuildPrice);

    let packageTotal = 0;
    switch (paymentMethod) {
      case 'Turnkey Payment method':
        packageTotal = land.gross + build.gross + extrasGross;
        const calculatedTurnKeyFee = this.getTurnKeyFee(packageTotal, turnKeyFee, autoCalcTurnkey, specVersion);
        const turnKey = this.gstService.getBreakdown(calculatedTurnKeyFee);
        quote.build = build;
        quote.land = land;
        quote.commitment = commitment;
        quote.turnKey = turnKey;
        quote.extrasList = [].concat(extrasList);
        quote.net = build.net + land.net + turnKey.net + extras.net - commitment.net;
        quote.gst = build.gst + land.gst + turnKey.gst + extras.gst - commitment.gst;
        quote.gross = build.gross + land.gross + turnKey.gross + extras.gross - commitment.gross;
        break;

      case 'Build Only':
        quote.build = build;
        quote.land = land;
        quote.commitment = commitment;
        quote.extrasList = [].concat(extrasList);
        quote.net = build.net + extras.net - commitment.net;
        quote.gst = build.gst + extras.gst - commitment.gst;
        quote.gross = build.gross + extrasGross - commitment.gross;
        break;

      default:
        quote.build = build;
        quote.land = land;
        quote.commitment = commitment;
        quote.extrasList = [].concat(extrasList);
        quote.net = build.net + land.net + extras.net - commitment.net;
        quote.gst = build.gst + land.gst + extras.gst - commitment.gst;
        quote.gross = build.gross + land.gross + extrasGross - commitment.gross;
        break;
    }
    quote.totalBuild = totalBuild;
    return quote;
  }

  public getTurnKeyFee(amount: number, turnKeyFee: number, autoCalcTurnkey: boolean, specVersion: number) {
    if (autoCalcTurnkey === undefined || autoCalcTurnkey) {
      const turnKeyLowerRate = specVersion >= 4 ? 0.03 : 0.015;
      const turnKeyHigherRate = specVersion >= 4 ? 0.03 : 0.02;
      return amount >= 600000 ? amount * turnKeyHigherRate : amount * turnKeyLowerRate;
    }
    return turnKeyFee;
  }
}
