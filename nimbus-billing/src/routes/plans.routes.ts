import { Router } from 'express';
import { planController } from '../controllers';

const router = Router();

router.get('/', planController.getAllPlans);
router.get('/:planId', planController.getPlanById);

export default router;
