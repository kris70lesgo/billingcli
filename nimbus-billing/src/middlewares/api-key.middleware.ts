import { Request, Response, NextFunction } from 'express';
import { config } from '../config';

export function apiKeyAuth(req: Request, res: Response, next: NextFunction): void {
  // Skip auth for health check
  if (req.path === '/health') {
    next();
    return;
  }

  const apiKey = req.headers['x-api-key'] as string | undefined;

  if (!apiKey) {
    res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Missing x-api-key header',
      },
    });
    return;
  }

  if (apiKey !== config.apiKey) {
    res.status(403).json({
      error: {
        code: 'FORBIDDEN',
        message: 'Invalid API key',
      },
    });
    return;
  }

  next();
}
