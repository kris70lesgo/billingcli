import express from 'express';
import { requestLogger, errorHandler } from './middlewares';
// import { apiKeyAuth } from './middlewares'; // Uncomment to enable API key auth
import { healthRoutes, planRoutes, subscriptionRoutes, internalRoutes } from './routes';

const app = express();

// Core middleware
app.use(express.json());
app.use(requestLogger);

// Optional API key auth (comment out to disable)
// app.use(apiKeyAuth);

// Routes
app.use('/health', healthRoutes);
app.use('/plans', planRoutes);
app.use('/subscriptions', subscriptionRoutes);
app.use('/internal', internalRoutes);

// Error handling (must be last)
app.use(errorHandler);

export default app;
