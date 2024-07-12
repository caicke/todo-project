import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { PrismaService } from '../prisma/prisma.service';
import { INestApplication } from '@nestjs/common';

describe('TodoService', () => {
  let service: TodoService;

  const mockPrismaService = {
    todo: {
      create: jest.fn().mockImplementation(dto => ({
        id: '1',
        ...dto.data,
      })),
      findMany: jest.fn().mockReturnValue([
        {
          id: '1',
          title: 'Test Todo',
          description: 'Test Description',
          isCompleted: false,
          userId: '1',
        },
      ]),
      findFirst: jest.fn().mockImplementation(params => {
        const { id } = params.where;
        if (id === '1') {
          return {
            id: '1',
            title: 'Test Todo',
            description: 'Test Description',
            isCompleted: false,
            userId: '1',
          };
        }
        return null;
      }),
      update: jest.fn().mockImplementation(params => ({
        id: params.where.id,
        ...params.data,
      })),
      delete: jest.fn().mockImplementation(params => ({
        id: params.where.id,
        title: 'Deleted Todo',
        description: 'Deleted Description',
        isCompleted: false,
        userId: '1',
      })),
    },
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = moduleFixture.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a todo', async () => {
    const result = await service.create({
      title: 'Test Todo',
      description: 'Test Description',
      userId: '1',
    });
    expect(result).toEqual({
      id: expect.any(String),
      title: 'Test Todo',
      description: 'Test Description',
      isCompleted: false,
      userId: '1',
    });
    expect(mockPrismaService.todo.create).toHaveBeenCalledWith({
      data: {
        title: 'Test Todo',
        description: 'Test Description',
        isCompleted: false,
        userId: '1',
      },
    });
  });

  it('should return all todos', async () => {
    const result = await service.findAll();
    expect(result).toEqual([
      {
        id: '1',
        title: 'Test Todo',
        description: 'Test Description',
        isCompleted: false,
        userId: '1',
      },
    ]);
    expect(mockPrismaService.todo.findMany).toHaveBeenCalled();
  });

  it('should return a todo by id', async () => {
    const result = await service.findOne('1');
    expect(result).toEqual({
      id: '1',
      title: 'Test Todo',
      description: 'Test Description',
      isCompleted: false,
      userId: '1',
    });
    expect(mockPrismaService.todo.findFirst).toHaveBeenCalledWith({
      where: { id: '1' },
    });
  });

  it('should update a todo', async () => {
    const result = await service.update('1', {
      title: 'Updated Todo',
      description: 'Updated Description',
      isCompleted: true,
    });
    expect(result).toEqual({
      id: '1',
      title: 'Updated Todo',
      description: 'Updated Description',
      isCompleted: true,
    });
    expect(mockPrismaService.todo.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: {
        title: 'Updated Todo',
        description: 'Updated Description',
        isCompleted: true,
      },
    });
  });

  it('should delete a todo', async () => {
    const result = await service.remove('1');
    expect(result).toEqual({
      id: '1',
      title: 'Deleted Todo',
      description: 'Deleted Description',
      isCompleted: false,
      userId: '1',
    });
    expect(mockPrismaService.todo.delete).toHaveBeenCalledWith({
      where: { id: '1' },
    });
  });
});
