import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GstService {
  constructor() {}

  public getBreakdown(amount: number | string) {
    const gross = this.getGross(amount);
    return amount == 'pending'
      ? { net: 0, gst: 0, gross: 0 }
      : {
          net: this.getNet(gross),
          gst: this.getGST(gross),
          gross,
        };
  }

  public getGST(gross) {
    const num = parseFloat(gross);
    const net = this.getNet(num);
    return gross - net;
  }

  public getNet(gross) {
    return gross / 1.15;
  }

  public getGross(gross) {
    if (typeof gross === 'string') {
      gross = gross.replace(',', '');
    }
    return parseFloat(gross);
  }
}
