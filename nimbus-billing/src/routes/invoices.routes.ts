import { Router } from 'express';
import { subscriptionController } from '../controllers';

const router = Router();

// Internal cron endpoint for renewal simulation
router.post('/cron/renew', subscriptionController.renewSubscriptions);

export default router;
