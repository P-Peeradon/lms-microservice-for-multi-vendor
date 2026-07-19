import { connectRedis } from './redis';

const HOST_ADDRESS = process.env.HOST_ADDRESS || 'localhost';
const SERVICE_PORT = process.env.SERVICE_PORT || '4500';

async function startService() {
    console.log(`Auth service availability: http://${HOST_ADDRESS}:${SERVICE_PORT}`);
    await connectRedis();
    console.log('Auth service is available and Redis is connected.');
}

void startService().catch((error) => {
    console.error('Failed to start auth service:', error);
    process.exit(1);
});
