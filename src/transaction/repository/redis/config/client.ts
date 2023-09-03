import { Redis } from 'ioredis';
import { ENVS } from '../../../../shared/config';

export const redisClient = new Redis({
  host: ENVS.REDIS.HOST,
  port: ENVS.REDIS.PORT,
});
