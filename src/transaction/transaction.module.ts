import { Module } from '@nestjs/common';
import { CreateTransactionUseCase } from './use-case';
import { TransactionController } from './controller/transaction.controller';

@Module({
  imports: [],
  controllers: [TransactionController],
  providers: [CreateTransactionUseCase],
})
export class TransactionModule {}
