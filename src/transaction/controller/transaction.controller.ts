import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import { CreateTransactionUseCase } from '../use-case';
import { CreateTransactionDto } from '../dto';

@Controller('transactions')
export class TransactionController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
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
}
