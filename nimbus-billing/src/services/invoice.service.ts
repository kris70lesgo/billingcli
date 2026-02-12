import { v4 as uuidv4 } from 'uuid';
import { Invoice, InvoiceStatus } from '../models';
import { addDays } from '../utils/date';

const invoices: Map<string, Invoice> = new Map();

export function createInvoice(subscriptionId: string, amount: number): Invoice {
  const now = new Date();
  const invoice: Invoice = {
    id: uuidv4(),
    subscriptionId,
    status: 'issued',
    amount,
    issuedAt: now,
    dueAt: addDays(now, 30),
  };
  invoices.set(invoice.id, invoice);
  return invoice;
}

export function getInvoicesBySubscriptionId(subscriptionId: string): Invoice[] {
  return Array.from(invoices.values()).filter(
    (inv) => inv.subscriptionId === subscriptionId
  );
}

export function getInvoiceById(id: string): Invoice | undefined {
  return invoices.get(id);
}

export function updateInvoiceStatus(id: string, status: InvoiceStatus): Invoice | undefined {
  const invoice = invoices.get(id);
  if (!invoice) return undefined;
  invoice.status = status;
  invoices.set(id, invoice);
  return invoice;
}

export function getAllInvoices(): Invoice[] {
  return Array.from(invoices.values());
}
