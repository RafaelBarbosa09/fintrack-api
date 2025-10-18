import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateTransactionUseCase } from '../../application/usecase/create-transaction.usecase';
import { GetTransactionsUseCase } from '../../application/usecase/get-transactions.usecase';
import { FindTransactionUseCase } from '../../application/usecase/find-transaction.usecase';
import { UpdateTransactionUseCase } from '../../application/usecase/update-transaction.usecase';
import { DeleteTransactionUseCase } from '../../application/usecase/delete-transaction.usecase';
import { CreateTransactionDto } from '../../infrastructure/controller/dto/create-transaction.dto';
import { UpdateTransactionDto } from '../../infrastructure/controller/dto/update-transaction.dto';

/**
 * CONTROLLER - Interface Adapter
 * Camada de Interface Adapters
 * Converte requisições HTTP em chamadas para Use Cases
 * Não contém lógica de negócio, apenas orquestração
 */
@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly getTransactionsUseCase: GetTransactionsUseCase,
    private readonly findTransactionUseCase: FindTransactionUseCase,
    private readonly updateTransactionUseCase: UpdateTransactionUseCase,
    private readonly deleteTransactionUseCase: DeleteTransactionUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    return await this.createTransactionUseCase.execute(createTransactionDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.getTransactionsUseCase.execute();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return await this.findTransactionUseCase.execute(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    return await this.updateTransactionUseCase.execute(
      id,
      updateTransactionDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return await this.deleteTransactionUseCase.execute(id);
  }
}
