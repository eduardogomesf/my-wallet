import { TransactionType } from '../../../shared';

export interface CreateNewTransactionRepository {
  createNewTransaction(
    userId: string,
    amount: number,
    type: TransactionType,
  ): Promise<void>;
}
