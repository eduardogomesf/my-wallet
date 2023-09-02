import { TransactionType } from '../interface';

export type CreateTransactionDto = {
  amount: number;
  userId: string;
  type: TransactionType;
  name: string;
};
