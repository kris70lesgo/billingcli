import { Plan } from '../models';

const plans: Map<string, Plan> = new Map();

// Pre-seed plans
function seedPlans(): void {
  const seedData: Plan[] = [
    {
      id: 'basic-monthly',
      name: 'Basic Monthly',
      price: 9.99,
      currency: 'USD',
      billingCycle: 'monthly',
      features: ['5 projects', '10GB storage', 'Email support'],
      active: true,
      createdAt: new Date('2024-01-01T00:00:00Z'),
    },
    {
      id: 'pro-monthly',
      name: 'Pro Monthly',
      price: 29.99,
      currency: 'USD',
      billingCycle: 'monthly',
      features: ['25 projects', '100GB storage', 'Priority support', 'API access', 'Custom integrations'],
      active: true,
      createdAt: new Date('2024-01-01T00:00:00Z'),
    },
    {
      id: 'enterprise-annual',
      name: 'Enterprise Annual',
      price: 299.99,
      currency: 'USD',
      billingCycle: 'annual',
      features: [
        'Unlimited projects',
        '1TB storage',
        '24/7 dedicated support',
        'API access',
        'Custom integrations',
        'SLA guarantee',
        'SSO',
        'Audit logs',
      ],
      active: true,
      createdAt: new Date('2024-01-01T00:00:00Z'),
    },
  ];

  for (const plan of seedData) {
    plans.set(plan.id, plan);
  }
}

seedPlans();

export function getAllPlans(): Plan[] {
  return Array.from(plans.values()).filter((p) => p.active);
}

export function getPlanById(id: string): Plan | undefined {
  return plans.get(id);
}
