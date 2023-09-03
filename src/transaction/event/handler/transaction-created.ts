import { redisClient } from '../../repository/redis/config';
import { generateUserBalanceKey } from '../../repository/redis/helper';
import { eventDispatcher } from '../dispatcher';
import { EVENTS } from '../events';

eventDispatcher.on(EVENTS.USER_TRANSACTION_CREATED, async (userId: string) => {
  console.log('Delete user balance from redis: ', userId);
  const userBalanceKey = generateUserBalanceKey(userId);
  await redisClient.del(userBalanceKey);
});
