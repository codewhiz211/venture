import { TestBed, inject } from '@angular/core/testing';

import { GstService } from './gst.service';
import { QuoteService } from './quote.service';

const toDecimalString = (num) => num.toFixed(2);

describe('QuoteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuoteService, GstService],
    });
  });

  it('should be created', inject([QuoteService], (service: QuoteService) => {
    expect(service).toBeTruthy();
  }));

  it('GetQuote returns correct value, when Turnkey Payment method, and no extras', inject([QuoteService], (service: QuoteService) => {
    const quote = service.getQuote('Turnkey Payment method', 1000, 2000, 10, undefined, true, 3.01, []);
    expect(toDecimalString(quote.net)).toEqual('2639.13'); //TBC
    expect(toDecimalString(quote.gst)).toEqual('395.87'); //TBC
    expect(toDecimalString(quote.gross)).toEqual('3035.00');
  }));

  it('GetQuote returns correct value, when Build Only, and no extras', inject([QuoteService], (service: QuoteService) => {
    const quote = service.getQuote('Build Only', 1000, 2000, 10, undefined, true, 3.01, []);
    expect(toDecimalString(quote.net)).toEqual('1730.43'); //TBC
    expect(toDecimalString(quote.gst)).toEqual('259.57'); //TBC
    expect(toDecimalString(quote.gross)).toEqual('1990.00');
  }));

  it('GetQuote returns correct value, when Progress Payment (default), and no extras', inject([QuoteService], (service: QuoteService) => {
    const quote = service.getQuote(' Progress Payment method', 1000, 2000, 10, undefined, true, 3.01, []);
    expect(toDecimalString(quote.net)).toEqual('2600.00'); //TBC
    expect(toDecimalString(quote.gst)).toEqual('390.00'); //TBC
    expect(toDecimalString(quote.gross)).toEqual('2990.00');
  }));

  //with extras

  it('GetQuote returns correct total build price and quote price, with extras and "Turnkey Payment method"', inject(
    [QuoteService],
    (service: QuoteService) => {
      const extrasList = [
        {
          amount: 7500,
        },
        {
          amount: 2500,
        },
        {
          amount: -1000,
        },
      ];
      const quote = service.getQuote('Turnkey Payment method', 10000, 20000, 1000, 2000, false, 3.01, extrasList);
      expect(toDecimalString(quote.totalBuild.gross)).toEqual('29000.00');
      expect(toDecimalString(quote.totalBuild.net)).toEqual('25217.39');
      expect(toDecimalString(quote.totalBuild.gst)).toEqual('3782.61');
      expect(toDecimalString(quote.gross)).toEqual('40000.00');
      expect(toDecimalString(quote.net)).toEqual('34782.61');
      expect(toDecimalString(quote.gst)).toEqual('5217.39');
    }
  ));

  it('GetQuote returns correct quote price, with extras and "Progress Payment method"', inject([QuoteService], (service: QuoteService) => {
    const extrasList = [
      {
        amount: 7500,
      },
      {
        amount: 2500,
      },
      {
        amount: -1000,
      },
    ];
    const quote = service.getQuote('Progress Payment method', 10000, 20000, 1000, 2000, false, 3.01, extrasList);
    expect(toDecimalString(quote.gross)).toEqual('38000.00');
    expect(toDecimalString(quote.net)).toEqual('33043.48');
    expect(toDecimalString(quote.gst)).toEqual('4956.52');
  }));

  it('GetQuote returns correct quote price, with extras and "Build Only"', inject([QuoteService], (service: QuoteService) => {
    const extrasList = [
      {
        amount: 7500,
      },
      {
        amount: 2500,
      },
      {
        amount: -1000,
      },
    ];
    const quote = service.getQuote('Build Only', 10000, 20000, 1000, 2000, false, 3.01, extrasList);
    expect(toDecimalString(quote.gross)).toEqual('28000.00');
    expect(toDecimalString(quote.net)).toEqual('24347.83');
    expect(toDecimalString(quote.gst)).toEqual('3652.17');
  }));

  // Turn Key Fees

  it('calculateCorrectTurnKeyFeeWhenValueIsGreaterThan600K', inject([QuoteService], (service: QuoteService) => {
    const turnKeyFee = service.getTurnKeyFee(750000, 1000, true, 3.01);
    expect(toDecimalString(turnKeyFee)).toEqual('15000.00');
  }));

  it('calculateCorrectTurnKeyFeeWhenValueIsLessThan600K', inject([QuoteService], (service: QuoteService) => {
    const turnKeyFee = service.getTurnKeyFee(500000, 2000, true, 3.01);
    expect(toDecimalString(turnKeyFee)).toEqual('7500.00');
  }));
});
