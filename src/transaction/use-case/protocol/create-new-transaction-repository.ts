import { TransactionType } from '../../interface';

export type CreateNewTransactionRepositoryParams = {
  userId: string;
  amount: number;
  type: TransactionType;
  date: Date;
  name: string;
  transactionId: string;
};

export interface CreateNewTransactionRepository {
  createNewTransaction(
    data: CreateNewTransactionRepositoryParams,
  ): Promise<void>;
}
