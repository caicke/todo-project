import { Injectable } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

import { data } from '../data/todos'
import { Todo } from './entities/todo.entity';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class TodoService {

  constructor(private prisma: PrismaService) {

  }

  async create(createTodoDto: CreateTodoDto) {
    await this.prisma.todo.create({
      data: {
        title: createTodoDto.title,
        description: createTodoDto.description,
        isCompleted: false,
        userId: createTodoDto.userId
      }
    });
  }

  async findAll() {
    return await this.prisma.todo.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.todo.findFirst({
      where: {
        id: id
      }
    });
  }

  async findByUser(userId: string) {
    return await this.prisma.todo.findMany({
      where: {
        userId: userId
      }
    });
  }

  async update(id: string, updateTodoDto: UpdateTodoDto) {
    return await this.prisma.todo.update({
      where: {
        id: id
      },
      data: {
        title: updateTodoDto.title,
        description: updateTodoDto.description,
        isCompleted: updateTodoDto.isCompleted
      }
    });
  }


  async remove(id: string) {
    return await this.prisma.todo.delete({
      where: {
        id: id
      }
    });
  }
}
