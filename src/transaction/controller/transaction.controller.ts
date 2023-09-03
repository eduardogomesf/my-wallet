import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTransactionUseCase, GetUserBalanceUseCase } from '../use-case';
import { CreateTransactionDto } from '../dto';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly getUserBalanceUseCase: GetUserBalanceUseCase,
  ) {}

  @HttpCode(201)
  @Post()
  async create(@Body() body: CreateTransactionDto) {
    const result = await this.createTransactionUseCase.create(body);

    if (result.ok) {
      return null;
    }

    throw new BadRequestException({
      message: result.error.message,
      code: result.error.code,
    });
  }

  @HttpCode(200)
  @Get()
  async getBalance(@Query('userId') userId: string) {
    const result = await this.getUserBalanceUseCase.getBalance(userId);

    if (result.ok) {
      return {
        balance: result.data,
      };
    }

    throw new BadRequestException({
      message: result.error.message,
      code: result.error.code,
    });
  }
}
