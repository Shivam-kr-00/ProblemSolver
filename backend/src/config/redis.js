import Redis from 'ioredis';
import { env } from './env.js';

let redisClient;

if (!global.redis) {
  global.redis = new Redis(env.upstashRedisUrl, {
    maxRetriesPerRequest: null,
    enableOfflineQueue: false,
    tls: {}, // IMPORTANT for Upstash //it enables TLS means secure connection
  });
}

redisClient = global.redis;

redisClient.on('connect', () => {
  console.log('🚀 Successfully connected to Redis!');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis Connection Error:', err);
});

export { redisClient };
