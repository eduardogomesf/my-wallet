import { BadRequestException } from '@nestjs/common';
import { TransactionController } from '../../../../src/transaction/controller';
import {
  CreateTransactionUseCase,
  GetUserBalanceUseCase,
} from '../../../../src/transaction/use-case';
import { TransactionType } from '../../../../src/transaction/interface';

const makeCreateTransactionUseCase = (): CreateTransactionUseCase => {
  return {
    create: jest.fn().mockResolvedValue({
      ok: true,
    }),
  } as any;
};

const makeGetUserBalanceUseCase = (): GetUserBalanceUseCase => {
  return {
    getBalance: jest.fn().mockResolvedValue({
      ok: true,
      data: 500,
    }),
  } as any;
};

describe('Transaction Controller', () => {
  let sut: TransactionController;
  let createTransactionUseCase: CreateTransactionUseCase;
  let getUserBalanceUseCase: GetUserBalanceUseCase;

  beforeEach(() => {
    createTransactionUseCase = makeCreateTransactionUseCase();
    getUserBalanceUseCase = makeGetUserBalanceUseCase();
    sut = new TransactionController(
      createTransactionUseCase,
      getUserBalanceUseCase,
    );
  });

  describe('Create Transaction', () => {
    it('Should return 400 if use case returns nok', async () => {
      jest.spyOn(createTransactionUseCase, 'create').mockResolvedValueOnce({
        ok: false,
        error: { message: 'any', code: 'any_code' },
      });

      const promise = sut.create({
        userId: 'any-id',
        amount: 500,
        type: TransactionType.CREDIT,
        name: 'any-name',
      });

      await expect(promise).rejects.toThrowError(
        new BadRequestException({
          message: 'any',
          code: 'any_code',
        }),
      );
    });

    it('Should return 201 if use case returns ok', async () => {
      const result = await sut.create({
        userId: 'any-id',
        amount: 500,
        type: TransactionType.CREDIT,
        name: 'any-name',
      });

      expect(result).toBeNull();
    });
  });

  describe('Get User Balance', () => {
    it('Should return balance if use case returns ok', async () => {
      const result = await sut.getBalance('any-id');

      expect(result).toEqual({ balance: 500 });
    });
    it('Should throw 400 if use case returns nok', async () => {
      jest.spyOn(getUserBalanceUseCase, 'getBalance').mockResolvedValueOnce({
        ok: false,
        error: { message: 'any', code: 'any_code' },
      });

      const promise = sut.getBalance('any-id');

      await expect(promise).rejects.toThrowError(
        new BadRequestException({
          message: 'any',
          code: 'any_code',
        }),
      );
    });
  });
});
