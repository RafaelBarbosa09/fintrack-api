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
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('transactions')
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
  @ApiOperation({ summary: 'Criar nova transação' })
  @ApiResponse({
    status: 201,
    description: 'Transação criada com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    return await this.createTransactionUseCase.execute(createTransactionDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar todas as transações' })
  @ApiResponse({
    status: 200,
    description: 'Lista de transações retornada com sucesso',
  })
  async findAll() {
    return await this.getTransactionsUseCase.execute();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Buscar transação por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID da transação',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Transação encontrada',
  })
  @ApiResponse({
    status: 404,
    description: 'Transação não encontrada',
  })
  async findOne(@Param('id') id: string) {
    return await this.findTransactionUseCase.execute(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Atualizar transação' })
  @ApiParam({
    name: 'id',
    description: 'ID da transação',
  })
  @ApiResponse({
    status: 200,
    description: 'Transação atualizada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Transação não encontrada',
  })
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
  @ApiOperation({ summary: 'Deletar transação' })
  @ApiParam({
    name: 'id',
    description: 'ID da transação',
  })
  @ApiResponse({
    status: 204,
    description: 'Transação deletada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Transação não encontrada',
  })
  async remove(@Param('id') id: string) {
    return await this.deleteTransactionUseCase.execute(id);
  }
}
