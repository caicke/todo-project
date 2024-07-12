import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { INestApplication, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtGuard } from '../auth/guards';
import { TodoModule } from './todo.module';
import * as request from 'supertest';

describe('TodoController', () => {
  let controller: TodoController;
  let service: TodoService;
  let app: INestApplication;

  const mockTodoService = {
    create: jest.fn(dto => (
      {}
    )),
    findAll: jest.fn(() => [
      {
        id: '1', title: 'Test Todo',
        description: 'Test Description',
        isCompleted: false,
        userId: '1'
      }
    ]),
    findOne: jest.fn(id => id === '1' ? {
      id: id,
      title: 'Test Todo',
      description: 'Test Description',
      isCompleted: false,
      userId: '1'
    } : null),
    findByUser: jest.fn(userId => [{
      id: '1', title: 'Test Todo',
      description: 'Test Description',
      isCompleted: false,
      userId
    }]),
    update: jest.fn((id, dto) => ({ id, ...dto })),
    remove: jest.fn(id => { })
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TodoModule],
    })
      .overrideProvider(TodoService)
      .useValue(mockTodoService)
      .overrideGuard(JwtGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('create todo must return 204', () => {
    return request(app.getHttpServer())
      .post('/todos')
      .send({
        title: 'Test Todo',
        description: 'Test Description',
        userId: '1',
      })
      .expect(204);
  });

  it('get all todos must return list of all todos', () => {
    return request(app.getHttpServer())
      .get('/todos')
      .expect(200)
      .expect([
        {
          id: '1',
          title: 'Test Todo',
          description: 'Test Description',
          isCompleted: false,
          userId: '1',
        },
      ]);
  });

  it('GET by ID must return information of todo with ID passed by parameter', () => {
    return request(app.getHttpServer())
      .get('/todos/1')
      .expect(200)
      .expect({
        id: '1',
        title: 'Test Todo',
        description: 'Test Description',
        isCompleted: false,
        userId: '1',
      });
  });

  it('put must return 200 with the updated todo information', () => {
    return request(app.getHttpServer())
      .put('/todos/1')
      .send({
        title: 'Updated Todo',
        description: 'Updated Description',
        isCompleted: true,
        userId: '1',
      })
      .expect(200)
      .expect({
        id: '1',
        title: 'Updated Todo',
        description: 'Updated Description',
        isCompleted: true,
        userId: '1',
      });
  });

  it('delete must return 204 with no body', () => {
    return request(app.getHttpServer())
      .delete('/todos/1')
      .expect(204);
  });

  afterAll(async () => {
    await app.close();
  });
});
