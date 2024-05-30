export interface Quote {
  uid: string;
  consultant: string;
  buildPrice: string;
  paymentMethod: string;
  landPrice: string;
  initialCommitment: string;
  adjustments: any[];
  version: string;
  turnkeyFee?: string;
  autoCalcTurnkeyFee?: boolean;
}
