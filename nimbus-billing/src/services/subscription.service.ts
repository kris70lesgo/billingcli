import { v4 as uuidv4 } from 'uuid';
import { Subscription, SubscriptionStatus } from '../models';
import { AppError } from '../utils/errors';
import { calculatePeriodEnd } from '../utils/date';
import * as planService from './plan.service';
import * as invoiceService from './invoice.service';
import { CreateSubscriptionInput, UpdateSubscriptionInput, QueryParamsInput } from '../validators/subscription.validator';

const subscriptions: Map<string, Subscription> = new Map();

export function createSubscription(input: CreateSubscriptionInput): Subscription {
  const plan = planService.getPlanById(input.plan);
  if (!plan) {
    throw AppError.notFound('Plan', input.plan);
  }

  if (!plan.active) {
    throw AppError.conflict(`Plan '${input.plan}' is not active`);
  }

  const now = new Date();
  const status: SubscriptionStatus =
    input.trialPeriod !== null && input.trialPeriod > 0 ? 'trialing' : 'active';

  const subscription: Subscription = {
    id: uuidv4(),
    customerId: input.customerId,
    plan: input.plan,
    billingCycle: input.billingCycle,
    currency: input.currency ?? 'USD',
    status,
    trialPeriod: input.trialPeriod ?? null,
    startDate: now,
    currentPeriodEnd: calculatePeriodEnd(now, input.billingCycle),
    autoRenew: input.autoRenew ?? true,
    createdAt: now,
    updatedAt: now,
  };

  subscriptions.set(subscription.id, subscription);

  // Auto-generate invoice on creation
  invoiceService.createInvoice(subscription.id, plan.price);

  return subscription;
}

export function getAllSubscriptions(query: QueryParamsInput): {
  data: Subscription[];
  total: number;
  page: number;
  limit: number;
} {
  let results = Array.from(subscriptions.values());

  if (query.customerId) {
    results = results.filter((s) => s.customerId === query.customerId);
  }
  if (query.status) {
    results = results.filter((s) => s.status === query.status);
  }
  if (query.plan) {
    results = results.filter((s) => s.plan === query.plan);
  }

  const total = results.length;
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  const start = (page - 1) * limit;
  const paginatedResults = results.slice(start, start + limit);

  return { data: paginatedResults, total, page, limit };
}

export function getSubscriptionById(id: string): Subscription {
  const sub = subscriptions.get(id);
  if (!sub) {
    throw AppError.notFound('Subscription', id);
  }
  return sub;
}

export function updateSubscription(id: string, input: UpdateSubscriptionInput): Subscription {
  const sub = subscriptions.get(id);
  if (!sub) {
    throw AppError.notFound('Subscription', id);
  }

  if (sub.status === 'canceled') {
    throw AppError.conflict('Cannot update a canceled subscription');
  }

  if (input.autoRenew !== undefined) {
    sub.autoRenew = input.autoRenew;
  }
  if (input.billingCycle !== undefined) {
    sub.billingCycle = input.billingCycle;
    sub.currentPeriodEnd = calculatePeriodEnd(sub.startDate, input.billingCycle);
  }
  if (input.currency !== undefined) {
    sub.currency = input.currency;
  }

  sub.updatedAt = new Date();
  subscriptions.set(id, sub);
  return sub;
}

export function cancelSubscription(id: string): Subscription {
  const sub = subscriptions.get(id);
  if (!sub) {
    throw AppError.notFound('Subscription', id);
  }

  if (sub.status === 'canceled') {
    throw AppError.conflict('Subscription is already canceled');
  }

  if (!['trialing', 'active', 'paused'].includes(sub.status)) {
    throw AppError.conflict(
      `Cannot cancel subscription with status '${sub.status}'`
    );
  }

  sub.status = 'canceled';
  sub.autoRenew = false;
  sub.updatedAt = new Date();
  subscriptions.set(id, sub);
  return sub;
}

export function pauseSubscription(id: string): Subscription {
  const sub = subscriptions.get(id);
  if (!sub) {
    throw AppError.notFound('Subscription', id);
  }

  if (sub.status === 'canceled') {
    throw AppError.conflict('Cannot pause a canceled subscription');
  }

  if (sub.status !== 'active') {
    throw AppError.conflict(
      `Cannot pause subscription with status '${sub.status}'. Only active subscriptions can be paused.`
    );
  }

  sub.status = 'paused';
  sub.updatedAt = new Date();
  subscriptions.set(id, sub);
  return sub;
}

export function resumeSubscription(id: string): Subscription {
  const sub = subscriptions.get(id);
  if (!sub) {
    throw AppError.notFound('Subscription', id);
  }

  if (sub.status === 'canceled') {
    throw AppError.conflict('Cannot resume a canceled subscription');
  }

  if (sub.status !== 'paused') {
    throw AppError.conflict(
      `Cannot resume subscription with status '${sub.status}'. Only paused subscriptions can be resumed.`
    );
  }

  sub.status = 'active';
  sub.updatedAt = new Date();
  subscriptions.set(id, sub);
  return sub;
}

export function renewSubscriptions(): {
  renewed: number;
  invoicesGenerated: number;
  details: Array<{ subscriptionId: string; newPeriodEnd: string; invoiceId: string }>;
} {
  const now = new Date();
  let renewed = 0;
  let invoicesGenerated = 0;
  const details: Array<{ subscriptionId: string; newPeriodEnd: string; invoiceId: string }> = [];

  for (const sub of subscriptions.values()) {
    if (
      sub.status === 'active' &&
      sub.autoRenew &&
      sub.currentPeriodEnd <= now
    ) {
      sub.currentPeriodEnd = calculatePeriodEnd(now, sub.billingCycle);
      sub.updatedAt = now;
      subscriptions.set(sub.id, sub);

      const plan = planService.getPlanById(sub.plan);
      const amount = plan ? plan.price : 0;
      const invoice = invoiceService.createInvoice(sub.id, amount);

      renewed++;
      invoicesGenerated++;
      details.push({
        subscriptionId: sub.id,
        newPeriodEnd: sub.currentPeriodEnd.toISOString(),
        invoiceId: invoice.id,
      });
    }
  }

  return { renewed, invoicesGenerated, details };
}
