import { Injectable } from '@nestjs/common';
import { GetUserBalanceRepository } from '../../use-case/protocol';
import { eventStoreClient } from './config';
import { getTransactionStreamName } from './helper';
import { StreamNotFoundError } from '@eventstore/db-client';

@Injectable()
export class ESGetUserBalanceRepossitory implements GetUserBalanceRepository {
  async getBalance(userId: string): Promise<number> {
    try {
      const streamName = getTransactionStreamName(userId);

      const events = eventStoreClient.readStream(streamName, { maxCount: 100 });

      let total = 0;

      for await (const { event } of events) {
        const data = event?.data ? (event.data as any) : {};

        if (event.type === 'FundsCredited') {
          total += Number(data.amount);
        } else if (event.type === 'FundsDebited') {
          total -= Number(data.amount);
        }
      }

      return total;
    } catch (error) {
      if (!(error instanceof StreamNotFoundError)) {
        throw error;
      }

      console.log('Stream does not exist');
      return 0;
    }
  }
}
