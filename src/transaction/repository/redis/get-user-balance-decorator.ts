/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { GetUserBalanceRepository } from '../../use-case/protocol';
import { ESGetUserBalanceRepossitory } from '../event-store/get-user-balance.repository';
import { redisClient } from './config';
import { generateUserBalanceKey } from './helper';

@Injectable()
export class RedisGetUserBalanceRepository
  implements GetUserBalanceRepository {
  constructor(private readonly repository: ESGetUserBalanceRepossitory) {}

  async getBalance(userId: string): Promise<number> {
    let balanceFromCache = null;

    const userBalanceKey = generateUserBalanceKey(userId);

    try {
      balanceFromCache = await redisClient.get(userBalanceKey)
    } catch (error) {
      console.error('Error when trying to retrieve balance from redis', JSON.stringify(error));
    }

    if (balanceFromCache) {
      console.log('Balance retrieved from cache');
      return Number(balanceFromCache);
    }

    const balance = await this.repository.getBalance(userId);

    await redisClient.set(userBalanceKey, balance);

    return balance;
  }
}
