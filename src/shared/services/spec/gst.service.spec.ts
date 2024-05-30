import { TestBed, inject } from '@angular/core/testing';

import { GstService } from './gst.service';

const toDecimalString = num => num.toFixed(2);

describe('GstService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  // GST
  it('calculateCorrectGSTValue', inject([GstService], (service: GstService) => {
    const gst = service.getGST(200000);
    expect(toDecimalString(gst)).toEqual('26086.96');
  }));

  // NET
  it('calculateCorrectNETValue', inject([GstService], (service: GstService) => {
    const net = service.getNet(200000);
    expect(toDecimalString(net)).toEqual('173913.04');
  }));

  // GST, NET, GROSS Calcs

  it('calculateCorrectGrossValueWhenInputIsZeroString', inject([GstService], (service: GstService) => {
    const breakdown = service.getBreakdown('0');
    expect(breakdown.gross).toEqual(0);
  }));

  it('calculateCorrectGrossValueWhenInputIsNumberString', inject([GstService], (service: GstService) => {
    const breakdown = service.getBreakdown('100');
    expect(breakdown.gross).toEqual(100);
  }));

  // Ensure zero input returns zero answer

  it('calculateCorrectGrossValueWhenInputIsZero', inject([GstService], (service: GstService) => {
    const breakdown = service.getBreakdown(0);
    expect(breakdown.gross).toEqual(0);
  }));

  it('calculateCorrectNetValueWhenInputIsZero', inject([GstService], (service: GstService) => {
    const breakdown = service.getBreakdown(0);
    expect(breakdown.net).toEqual(0);
  }));

  it('calculateCorrectGstValueWhenInputIsZero', inject([GstService], (service: GstService) => {
    const breakdown = service.getBreakdown(0);
    expect(breakdown.net).toEqual(0);
  }));

  // calcs with a number

  it('calculateCorrectGrossValueWhenInputIs500K', inject([GstService], (service: GstService) => {
    const breakdown = service.getBreakdown(500000);
    expect(breakdown.gross).toEqual(500000);
  }));

  it('calculateCorrectGstValueWhenInputIs500K', inject([GstService], (service: GstService) => {
    const breakdown = service.getBreakdown(500000);
    expect(toDecimalString(breakdown.gst)).toEqual('65217.39'); // TBC
  }));

  it('calculateCorrectNetValueWhenInputIs500K', inject([GstService], (service: GstService) => {
    const breakdown = service.getBreakdown(500000);
    expect(toDecimalString(breakdown.net)).toEqual('434782.61'); // TBC
  }));
});
