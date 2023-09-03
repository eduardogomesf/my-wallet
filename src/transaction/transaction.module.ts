import { Module } from '@nestjs/common';
import { CreateTransactionUseCase } from './use-case';
import { TransactionController } from './controller/transaction.controller';
import { ESGetUserBalanceRepossitory } from './repository/event-store/get-user-balance.repository';
import { ESCreateNewTransactionRepository } from './repository/event-store/create-new-transaction.repository';
import { RedisGetUserBalanceRepository } from './repository/redis';

@Module({
  imports: [],
  controllers: [TransactionController],
  providers: [
    CreateTransactionUseCase,
    ESGetUserBalanceRepossitory,
    {
      provide: 'GetUserBalanceRepository',
      useClass: RedisGetUserBalanceRepository,
    },
    {
      provide: 'CreateNewTransactionRepository',
      useClass: ESCreateNewTransactionRepository,
    },
  ],
})
export class TransactionModule {}
