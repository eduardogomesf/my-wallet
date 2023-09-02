import { TransactionType } from '../../interface';

type CreateNewTransactionRepositoryParams = {
  userId: string;
  amount: number;
  type: TransactionType;
  date: Date;
  name: string;
};

export interface CreateNewTransactionRepository {
  createNewTransaction(
    data: CreateNewTransactionRepositoryParams,
  ): Promise<void>;
}
