# Nimbus Billing API

Production-structured SaaS Billing & Subscription API backend.

## Setup

```bash
cd nimbus-billing
npm install
```

## Run

```bash
# Development (hot-reload)
npm run dev

# Production
npm run build
npm start
```

Server starts at `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/plans` | List all plans |
| GET | `/plans/:planId` | Get plan by ID |
| POST | `/subscriptions` | Create subscription |
| GET | `/subscriptions` | List subscriptions (filterable) |
| GET | `/subscriptions/:id` | Get subscription |
| PUT | `/subscriptions/:id` | Update subscription |
| POST | `/subscriptions/:id/cancel` | Cancel subscription |
| POST | `/subscriptions/:id/pause` | Pause subscription |
| POST | `/subscriptions/:id/resume` | Resume subscription |
| GET | `/subscriptions/:id/invoices` | Get subscription invoices |
| POST | `/internal/cron/renew` | Simulate billing renewal |

## Example curl Commands

```bash
# Health check
curl http://localhost:3000/health

# List plans
curl http://localhost:3000/plans

# Get specific plan
curl http://localhost:3000/plans/pro-monthly

# Create subscription (with trial)
curl -X POST http://localhost:3000/subscriptions \
  -H "Content-Type: application/json" \
  -d '{"customerId":"cust-001","plan":"pro-monthly","billingCycle":"monthly","trialPeriod":14}'

# Create subscription (active immediately)
curl -X POST http://localhost:3000/subscriptions \
  -H "Content-Type: application/json" \
  -d '{"customerId":"cust-002","plan":"basic-monthly","billingCycle":"monthly"}'

# List subscriptions with filters
curl "http://localhost:3000/subscriptions?status=active&page=1&limit=10"

# Pause subscription
curl -X POST http://localhost:3000/subscriptions/{id}/pause

# Resume subscription
curl -X POST http://localhost:3000/subscriptions/{id}/resume

# Cancel subscription
curl -X POST http://localhost:3000/subscriptions/{id}/cancel

# Get invoices for subscription
curl http://localhost:3000/subscriptions/{id}/invoices

# Simulate billing renewal
curl -X POST http://localhost:3000/internal/cron/renew
```

## API Key Auth (Optional)

Uncomment `app.use(apiKeyAuth)` in `src/app.ts`, then pass:

```bash
curl -H "x-api-key: nimbus-dev-key-2024" http://localhost:3000/plans
```

## Pre-seeded Plans

| ID | Price | Cycle |
|----|-------|-------|
| `basic-monthly` | $9.99 | monthly |
| `pro-monthly` | $29.99 | monthly |
| `enterprise-annual` | $299.99 | annual |
