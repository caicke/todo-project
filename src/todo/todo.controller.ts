import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  NotFoundException,
  Put,
  HttpCode
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) { }

  @Post()
  @HttpCode(204)
  async create(@Body() createTodoDto: CreateTodoDto) {

    return await this.todoService.create(createTodoDto);
  }

  @Get()
  async findAll() {
    return await this.todoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {

    const todo = await this.todoService.findOne(id);

    if (!todo)
      throw new NotFoundException("Todo not found.");

    return todo;
  }

  @Get('from/:userId')
  async findByUser(@Param('userId') userId: string) {
    return await this.todoService.findByUser(userId);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return await this.todoService.update(id, updateTodoDto);
  }

  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.todoService.remove(id);
  }
}
