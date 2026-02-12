export type InvoiceStatus = 'issued' | 'pending' | 'paid' | 'failed';

export interface Invoice {
  id: string;
  subscriptionId: string;
  status: InvoiceStatus;
  amount: number;
  issuedAt: Date;
  dueAt: Date;
}
