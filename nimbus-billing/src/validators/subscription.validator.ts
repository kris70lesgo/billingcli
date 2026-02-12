import { z } from 'zod';

export const createSubscriptionSchema = z.object({
  customerId: z.string().min(1, 'customerId is required'),
  plan: z.string().min(1, 'plan is required'),
  billingCycle: z.enum(['monthly', 'annual']),
  currency: z.enum(['USD', 'EUR']).default('USD'),
  trialPeriod: z.number().int().min(0).nullable().default(null),
  autoRenew: z.boolean().default(true),
});

export const updateSubscriptionSchema = z.object({
  autoRenew: z.boolean().optional(),
  billingCycle: z.enum(['monthly', 'annual']).optional(),
  currency: z.enum(['USD', 'EUR']).optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be provided for update' }
);

export const queryParamsSchema = z.object({
  customerId: z.string().optional(),
  status: z.enum(['trialing', 'active', 'past_due', 'canceled', 'paused']).optional(),
  plan: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>;
export type QueryParamsInput = z.infer<typeof queryParamsSchema>;
