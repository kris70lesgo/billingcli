import app from './app';
import { config } from './config';

const { port, env } = config;

app.listen(port, () => {
  console.log(`\n🚀 Nimbus Billing API`);
  console.log(`   Environment: ${env}`);
  console.log(`   Port:        ${port}`);
  console.log(`   URL:         http://localhost:${port}`);
  console.log(`   Health:      http://localhost:${port}/health\n`);
});
