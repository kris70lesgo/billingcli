import { Request, Response, NextFunction } from 'express';
import * as planService from '../services/plan.service';
import { AppError } from '../utils/errors';

export function getAllPlans(_req: Request, res: Response): void {
  const plans = planService.getAllPlans();
  res.status(200).json(plans);
}

export function getPlanById(req: Request, res: Response, next: NextFunction): void {
  try {
    const plan = planService.getPlanById(req.params.planId);
    if (!plan) {
      throw AppError.notFound('Plan', req.params.planId);
    }
    res.status(200).json(plan);
  } catch (err) {
    next(err);
  }
}
