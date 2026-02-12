export type Currency = 'USD' | 'EUR';
export type BillingCycle = 'monthly' | 'annual';

export interface Plan {
  id: string;
  name: string;
  price: number;
  currency: Currency;
  billingCycle: BillingCycle;
  features: string[];
  active: boolean;
  createdAt: Date;
}
