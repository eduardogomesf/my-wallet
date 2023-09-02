import { Injectable } from '@nestjs/common';
import { ERROR_CODES, TransactionType, UseCaseResponse } from '../../shared';
import {
  CreateNewTransactionRepository,
  GetUserBalanceRepository,
} from './protocol';

type CreateTransactionUseCasePayload = {
  amount: number;
  userId: string;
  type: TransactionType;
};

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    private readonly getUserBalanceRepository: GetUserBalanceRepository,
    private readonly createNewTransactionRepository: CreateNewTransactionRepository,
  ) {}

  async create(
    data: CreateTransactionUseCasePayload,
  ): Promise<UseCaseResponse<null>> {
    const validation = this.validateParams(data);

    if (!validation.ok) {
      return validation;
    }

    const userBalance = await this.getUserBalanceRepository.getBalance(
      data.userId,
    );

    if (data.type === 'debit' && userBalance < data.amount) {
      return {
        ok: false,
        error: {
          message: 'Insufficient funds',
          code: ERROR_CODES.INSUFFICIENT_FUNDS,
        },
      };
    }

    await this.createNewTransactionRepository.createNewTransaction(
      data.userId,
      data.amount,
      data.type,
    );

    return {
      ok: true,
    };
  }

  validateParams(data: CreateTransactionUseCasePayload) {
    const { amount, userId, type } = data;

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

    if (type !== 'credit' && type !== 'debit') {
      return {
        ok: false,
        error: {
          message: 'Type must be credit or debit',
          code: ERROR_CODES.TYPE_MUST_BE_CREDIT_OR_DEBIT,
        },
      };
    }

    return {
      ok: true,
    };
  }
}
