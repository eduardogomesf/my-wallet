import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { UseCaseResponse } from '../../shared';
import {
  CreateNewTransactionRepository,
  EventDispatcher,
  GetUserBalanceRepository,
} from './protocol';
import { ERROR_CODES } from '../error';
import { TransactionType } from '../interface';
import { EVENTS } from '../event';

type CreateTransactionUseCasePayload = {
  amount: number;
  userId: string;
  type: TransactionType;
  name: string;
};

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject('GetUserBalanceRepository')
    private readonly getUserBalanceRepository: GetUserBalanceRepository,
    @Inject('CreateNewTransactionRepository')
    private readonly createNewTransactionRepository: CreateNewTransactionRepository,
    @Inject('EventDispatcher')
    private readonly eventDispatcher: EventDispatcher,
  ) {}

  async create(
    data: CreateTransactionUseCasePayload,
  ): Promise<UseCaseResponse<null>> {
    const transaction = {
      amount: data.amount,
      date: new Date(),
      type: data.type,
      userId: data.userId,
      name: data.name,
      transactionId: uuid(),
    };

    const validation = this.validateParams(transaction);

    if (!validation.ok) {
      return validation;
    }

    const userBalance = await this.getUserBalanceRepository.getBalance(
      transaction.userId,
    );

    if (
      transaction.type === TransactionType.DEBIT &&
      userBalance < transaction.amount
    ) {
      return {
        ok: false,
        error: {
          message: 'Insufficient funds',
          code: ERROR_CODES.INSUFFICIENT_FUNDS,
        },
      };
    }

    await this.createNewTransactionRepository.createNewTransaction({
      ...transaction,
    });

    this.eventDispatcher.dispatch(
      EVENTS.USER_TRANSACTION_CREATED,
      transaction.userId,
    );

    return {
      ok: true,
    };
  }

  validateParams(data: CreateTransactionUseCasePayload) {
    const { amount, userId, type, name } = data;

    if (!amount || amount <= 0) {
      return {
        ok: false,
        error: {
          message: 'Amount must be greater than 0',
          code: ERROR_CODES.AMOUNT_MUST_BE_GREATER_THAN_0,
        },
      };
    }

    if (!userId) {
      return {
        ok: false,
        error: {
          message: 'User id is required',
          code: ERROR_CODES.USER_ID_IS_REQUIRED,
        },
      };
    }

    if (type !== TransactionType.CREDIT && type !== TransactionType.DEBIT) {
      return {
        ok: false,
        error: {
          message: 'Type must be CREDIT or DEBIT',
          code: ERROR_CODES.TYPE_MUST_BE_CREDIT_OR_DEBIT,
        },
      };
    }

    if (!name) {
      return {
        ok: false,
        error: {
          message: 'Name is required',
          code: ERROR_CODES.NAME_IS_REQUIRED,
        },
      };
    }

    return {
      ok: true,
    };
  }
}
