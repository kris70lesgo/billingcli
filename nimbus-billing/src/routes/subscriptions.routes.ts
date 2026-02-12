import { Router } from 'express';
import { subscriptionController } from '../controllers';
import { validate } from '../middlewares/validate.middleware';
import {
  createSubscriptionSchema,
  updateSubscriptionSchema,
  queryParamsSchema,
} from '../validators/subscription.validator';

const router = Router();

router.post('/', validate(createSubscriptionSchema, 'body'), subscriptionController.createSubscription);
router.get('/', validate(queryParamsSchema, 'query'), subscriptionController.getAllSubscriptions);
router.get('/:id', subscriptionController.getSubscriptionById);
router.put('/:id', validate(updateSubscriptionSchema, 'body'), subscriptionController.updateSubscription);
router.post('/:id/cancel', subscriptionController.cancelSubscription);
router.post('/:id/pause', subscriptionController.pauseSubscription);
router.post('/:id/resume', subscriptionController.resumeSubscription);
router.get('/:id/invoices', subscriptionController.getSubscriptionInvoices);

export default router;
