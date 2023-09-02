import { TransactionType } from '../../shared';

export type CreateTransactionDto = {
  amount: number;
  userId: string;
  type: TransactionType;
};
