import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UserService', () => {
    let service: UserService;

    const mockPrismaService = {
        user: {
            findMany: jest.fn().mockReturnValue([
                {
                    id: "6646c53d84885089271de973",
                    firstName: "Test",
                    lastName: "of Todos",
                    email: "teste@email.com",
                    createdAt: "2024-05-17T02:47:23.874+00:00"
                },
            ])
        }
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService
                }
            ],
        }).compile();

        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should return users', async () => {
        const users = [
            {
                id: "6646c53d84885089271de973",
                firstName: "Test",
                lastName: "of Todos",
                email: "teste@email.com",
                createdAt: "2024-05-17T02:47:23.874+00:00"
            },
        ]
        expect(await service.findAll()).toEqual(users);
    })
});
