import { TransactionType } from '../../interface';

export interface CreateNewTransactionRepository {
  createNewTransaction(
    userId: string,
    amount: number,
    type: TransactionType,
  ): Promise<void>;
}
