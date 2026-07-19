import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL ?? `redis://localhost:${process.env.REDIS_PORT ?? 6379}`;
export const redisClient = createClient({ url: redisUrl });

redisClient.on('error', (error) => {
  console.error('Redis client error:', error);
});

export async function connectRedis(): Promise<void> {
  if (redisClient.isOpen) {
    console.log(`Redis connection already open: ${redisUrl}`);
    return;
  }

  try {
    await redisClient.connect();
    console.log(`Connected to Redis at ${redisUrl}`);
  } catch (error) {
    console.error('Error connecting to Redis:', error);
    throw error;
  }
}
