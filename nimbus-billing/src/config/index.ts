export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  apiKey: process.env.API_KEY || 'nimbus-dev-key-2024',
  env: process.env.NODE_ENV || 'development',
} as const;
