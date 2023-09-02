import { BadRequestException } from '@nestjs/common';
import { TransactionController } from '../../../../src/transaction/controller';
import { CreateTransactionUseCase } from '../../../../src/transaction/use-case';
import { TransactionType } from '../../../../src/transaction/interface';

const makeCreateTransactionUseCase = (): CreateTransactionUseCase => {
  return {
    create: jest.fn().mockResolvedValue({
      ok: true,
    }),
  } as any;
};

describe('Transaction Controller', () => {
  let sut: TransactionController;
  let createTransactionUseCase: CreateTransactionUseCase;

  beforeEach(() => {
    createTransactionUseCase = makeCreateTransactionUseCase();
    sut = new TransactionController(createTransactionUseCase);
  });

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
