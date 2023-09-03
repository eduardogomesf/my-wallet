import { ERROR_CODES } from '../../../../src/transaction/error';
import { GetUserBalanceUseCase } from '../../../../src/transaction/use-case';
import { GetUserBalanceRepository } from '../../../../src/transaction/use-case/protocol';

const makeGetUserBalanceRepository = (): GetUserBalanceRepository => {
  return {
    getBalance: jest.fn().mockResolvedValue(500),
  };
};

describe('Get User Balance Use Case', () => {
  let sut: GetUserBalanceUseCase;
  let getUserBalanceRepository: GetUserBalanceRepository;

  beforeEach(() => {
    getUserBalanceRepository = makeGetUserBalanceRepository();
    sut = new GetUserBalanceUseCase(getUserBalanceRepository);
  });

  it('should return nok if user id is not provided', async () => {
    const result = await sut.getBalance('');

    expect(result.ok).toBe(false);
    expect(result.data).toBeUndefined();
    expect(result.error.code).toBe(ERROR_CODES.USER_ID_IS_REQUIRED);
    expect(result.error.message).toBe('User id is required');
  });

  it('should return the balance', async () => {
    const result = await sut.getBalance('any-id');

    expect(result.ok).toBe(true);
    expect(result.data).toBe(500);
    expect(result.error).toBeUndefined();
  });
});
