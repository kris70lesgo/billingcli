export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'canceled' | 'paused';

export interface Subscription {
  id: string;
  customerId: string;
  plan: string;
  billingCycle: string;
  currency: string;
  status: SubscriptionStatus;
  trialPeriod: number | null;
  startDate: Date;
  currentPeriodEnd: Date;
  autoRenew: boolean;
  createdAt: Date;
  updatedAt: Date;
}
