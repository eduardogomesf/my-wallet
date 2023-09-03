import { Inject, Injectable } from '@nestjs/common';
import { UseCaseResponse } from '../../shared';
import { GetUserBalanceRepository } from './protocol';
import { ERROR_CODES } from '../error';

@Injectable()
export class GetUserBalanceUseCase {
  constructor(
    @Inject('GetUserBalanceRepository')
    private readonly getUserBalanceRepository: GetUserBalanceRepository,
  ) {}

  async getBalance(userId: string): Promise<UseCaseResponse<number>> {
    if (!userId) {
      return {
        ok: false,
        error: {
          message: 'User id is required',
          code: ERROR_CODES.USER_ID_IS_REQUIRED,
        },
      };
    }

    const userBalance = await this.getUserBalanceRepository.getBalance(userId);

    return {
      ok: true,
      data: userBalance,
    };
  }
}
