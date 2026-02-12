import { Request, Response, NextFunction } from 'express';
import * as subscriptionService from '../services/subscription.service';
import * as invoiceService from '../services/invoice.service';
import { CreateSubscriptionInput, UpdateSubscriptionInput, QueryParamsInput } from '../validators/subscription.validator';

export function createSubscription(req: Request, res: Response, next: NextFunction): void {
  try {
    const input = req.body as CreateSubscriptionInput;
    const subscription = subscriptionService.createSubscription(input);
    res.status(201).json(subscription);
  } catch (err) {
    next(err);
  }
}

export function getAllSubscriptions(req: Request, res: Response, next: NextFunction): void {
  try {
    const query = req.query as unknown as QueryParamsInput;
    const result = subscriptionService.getAllSubscriptions(query);
    res.status(200).json(result.data);
  } catch (err) {
    next(err);
  }
}

export function getSubscriptionById(req: Request, res: Response, next: NextFunction): void {
  try {
    const subscription = subscriptionService.getSubscriptionById(req.params.id);
    res.status(200).json(subscription);
  } catch (err) {
    next(err);
  }
}

export function updateSubscription(req: Request, res: Response, next: NextFunction): void {
  try {
    const input = req.body as UpdateSubscriptionInput;
    const subscription = subscriptionService.updateSubscription(req.params.id, input);
    res.status(200).json(subscription);
  } catch (err) {
    next(err);
  }
}

export function cancelSubscription(req: Request, res: Response, next: NextFunction): void {
  try {
    const subscription = subscriptionService.cancelSubscription(req.params.id);
    res.status(200).json(subscription);
  } catch (err) {
    next(err);
  }
}

export function pauseSubscription(req: Request, res: Response, next: NextFunction): void {
  try {
    const subscription = subscriptionService.pauseSubscription(req.params.id);
    res.status(200).json(subscription);
  } catch (err) {
    next(err);
  }
}

export function resumeSubscription(req: Request, res: Response, next: NextFunction): void {
  try {
    const subscription = subscriptionService.resumeSubscription(req.params.id);
    res.status(200).json(subscription);
  } catch (err) {
    next(err);
  }
}

export function getSubscriptionInvoices(req: Request, res: Response, next: NextFunction): void {
  try {
    // Validate subscription exists first
    subscriptionService.getSubscriptionById(req.params.id);
    const invoices = invoiceService.getInvoicesBySubscriptionId(req.params.id);
    res.status(200).json(invoices);
  } catch (err) {
    next(err);
  }
}

export function renewSubscriptions(_req: Request, res: Response, next: NextFunction): void {
  try {
    const result = subscriptionService.renewSubscriptions();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
