/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import {
  CreateNewTransactionRepository,
  CreateNewTransactionRepositoryParams,
} from '../../use-case/protocol';
import { eventStoreClient } from './config';
import { getTransactionStreamName } from './helper';
import { TransactionType } from '../../interface';
import { jsonEvent } from '@eventstore/db-client';

@Injectable()
export class ESCreateNewTransactionRepository
  implements CreateNewTransactionRepository {
  async createNewTransaction(
    data: CreateNewTransactionRepositoryParams,
  ): Promise<void> {
    const eventType = {
      [TransactionType.CREDIT]: 'FundsCredited',
      [TransactionType.DEBIT]: 'FundsDebited',
    };

    const type = eventType[data.type];

    const streamName = getTransactionStreamName(data.userId);

    const event = jsonEvent({ type, data });

    await eventStoreClient.appendToStream(streamName, event);
  }
}
