import { ERROR_CODES } from '../../../../src/transaction/error';
import { TransactionType } from '../../../../src/transaction/interface';
import { CreateTransactionUseCase } from '../../../../src/transaction/use-case';
import {
  CreateNewTransactionRepository,
  GetUserBalanceRepository,
} from '../../../../src/transaction/use-case/protocol';

const makeGetUserBalanceRepository = (): GetUserBalanceRepository => {
  return {
    getBalance: jest.fn().mockResolvedValue(500),
  };
};

const makeCreateNewTransactionRepository =
  (): CreateNewTransactionRepository => {
    return {
      createNewTransaction: jest.fn().mockResolvedValue(null),
    };
  };

describe('Create Transaction Use Case', () => {
  let sut: CreateTransactionUseCase;
  let getUserBalanceRepository: GetUserBalanceRepository;
  let createNewTransactionRepository: CreateNewTransactionRepository;

  beforeEach(() => {
    getUserBalanceRepository = makeGetUserBalanceRepository();
    createNewTransactionRepository = makeCreateNewTransactionRepository();
    sut = new CreateTransactionUseCase(
      getUserBalanceRepository,
      createNewTransactionRepository,
    );
  });

  describe('Params Validation', () => {
    it('should return nok if no userId is provided', async () => {
      const params = {
        userId: '',
        amount: 500,
        type: TransactionType.CREDIT,
      };

      const result = await sut.create(params);

      expect(result.ok).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.error.code).toBe(ERROR_CODES.USER_ID_IS_REQUIRED);
      expect(result.error.message).toBe('User id is required');
    });

    it('should return nok if an invalid amount is provided', async () => {
      const params = {
        userId: 'any-id',
        amount: 0,
        type: TransactionType.CREDIT,
      };

      const result = await sut.create(params);

      expect(result.ok).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.error.code).toBe(ERROR_CODES.AMOUNT_MUST_BE_GREATER_THAN_0);
      expect(result.error.message).toBe('Amount must be greater than 0');
    });

    it('should return nok if an invalid type is provided', async () => {
      const params = {
        userId: 'any-id',
        amount: 60,
        type: 'any-type' as TransactionType,
      };

      const result = await sut.create(params);

      expect(result.ok).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.error.code).toBe(ERROR_CODES.TYPE_MUST_BE_CREDIT_OR_DEBIT);
      expect(result.error.message).toBe('Type must be CREDIT or DEBIT');
    });
  });

  it('should return nok if user balance is insufficient', async () => {
    const params = {
      userId: 'any-id',
      amount: 600,
      type: TransactionType.DEBIT,
    };

    const result = await sut.create(params);

    expect(result.ok).toBe(false);
    expect(result.data).toBeUndefined();
    expect(result.error.code).toBe(ERROR_CODES.INSUFFICIENT_FUNDS);
    expect(result.error.message).toBe('Insufficient funds');
  });

  it('should create a transaction successfully', async () => {
    const params = {
      userId: 'any-id',
      amount: 60,
      type: TransactionType.CREDIT,
    };

    const result = await sut.create(params);

    expect(result.ok).toBe(true);
    expect(result.data).toBeUndefined();
    expect(result.error).toBeUndefined();
  });
});
