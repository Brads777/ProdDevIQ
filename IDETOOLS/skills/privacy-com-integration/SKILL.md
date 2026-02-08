---
name: privacy-com-integration
description: >
  Privacy.com virtual card API integration patterns. Create, manage, and
  monitor virtual payment cards for SaaS subscriptions, testing, and
  automated purchasing. Trigger on /privacy-cards.
allowed-tools: Read, Write, Edit, Bash
---
# ©2026 Brad Scheller

# Privacy.com Virtual Card Integration

**Purpose:** Integration patterns for Privacy.com's API to create and manage virtual payment cards. Useful for SaaS subscription management, payment testing, and automated purchasing workflows.

## Trigger Commands

- `/privacy-cards` — Show integration guide and setup steps
- `/privacy-cards setup` — Generate API client boilerplate
- `/privacy-cards test` — Create a test card for development

## API Overview

Privacy.com provides:
- **Virtual cards** — Generate unique card numbers for each merchant/subscription
- **Spend limits** — Set per-transaction, monthly, or lifetime limits
- **Pause/close** — Instantly disable cards without affecting other subscriptions
- **Webhooks** — Real-time transaction notifications
- **Merchant locking** — Cards that only work at one merchant

## Integration Patterns

### Basic Card Creation (Node.js)

```typescript
import { PrivacyClient } from './privacy-client';

const client = new PrivacyClient(process.env.PRIVACY_API_KEY);

// Create a single-use card
const card = await client.createCard({
  type: 'SINGLE_USE',
  spend_limit: 5000, // $50.00 in cents
  memo: 'Test purchase - development',
});

// Create a merchant-locked subscription card
const subscriptionCard = await client.createCard({
  type: 'MERCHANT_LOCKED',
  spend_limit: 2000, // $20.00/month
  spend_limit_duration: 'MONTHLY',
  memo: 'SaaS subscription - service-name',
});
```

### Webhook Handler

```typescript
app.post('/webhooks/privacy', (req, res) => {
  const event = req.body;
  switch (event.type) {
    case 'TRANSACTION_APPROVED':
      // Log successful charge
      break;
    case 'TRANSACTION_DECLINED':
      // Alert on declined — may indicate card compromise
      break;
    case 'CARD_CLOSED':
      // Update internal records
      break;
  }
  res.status(200).send('OK');
});
```

### Subscription Management Pattern

```typescript
// Create cards for each SaaS subscription
const subscriptions = [
  { name: 'GitHub', limit: 400 },
  { name: 'Vercel', limit: 2000 },
  { name: 'OpenAI', limit: 10000 },
];

for (const sub of subscriptions) {
  await client.createCard({
    type: 'MERCHANT_LOCKED',
    spend_limit: sub.limit,
    spend_limit_duration: 'MONTHLY',
    memo: `SaaS: ${sub.name}`,
  });
}
```

## Security Best Practices

1. **Never log full card numbers** — Use last-4 only
2. **Store API keys in environment variables** — Never in code
3. **Use merchant-locked cards** for subscriptions — Prevents unauthorized charges
4. **Set spend limits** on all cards — Defense in depth
5. **Monitor webhooks** — Alert on unexpected transactions
6. **Rotate API keys** periodically

## Use Cases

| Use Case | Card Type | Limit |
|----------|-----------|-------|
| SaaS subscriptions | Merchant-locked | Monthly |
| One-time purchases | Single-use | Per-transaction |
| Development/testing | Single-use | Low ($1-5) |
| Team expenses | Merchant-locked | Monthly per-person |
| API service billing | Merchant-locked | Monthly |

## Environment Setup

```env
PRIVACY_API_KEY=your_api_key_here
PRIVACY_WEBHOOK_SECRET=your_webhook_secret
PRIVACY_ENVIRONMENT=sandbox  # or production
```
