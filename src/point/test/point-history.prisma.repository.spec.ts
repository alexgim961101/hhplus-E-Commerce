import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/prisma/prisma.service';
import { PointHistoryPrismaRepository } from '@/point/infra/point-history.prisma.repository';
import { TransactionType } from '@prisma/client';

describe('PointHistoryPrismaRepository', () => {
    let repository: PointHistoryPrismaRepository;
    let prismaService: PrismaService;

    const mockPointHistory = {
        id: 1,
        userId: 1,
        points: 10000,
        transactionType: TransactionType.CHARGE,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PointHistoryPrismaRepository,
                {
                    provide: PrismaService,
                    useValue: {
                        pointHistory: {
                            create: jest.fn()
                        }
                    }
                }
            ]
        }).compile();

        repository = module.get<PointHistoryPrismaRepository>(PointHistoryPrismaRepository);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('create', () => {
        it('트랜잭션이 없을 경우 this.prisma를 사용해야 한다', async () => {
            // Given
            const createDto = {
                userId: 1,
                points: 10000,
                transactionType: TransactionType.CHARGE
            };
            
            jest.spyOn(prismaService.pointHistory, 'create').mockResolvedValue(mockPointHistory);

            // When
            await repository.create(createDto);

            // Then
            expect(prismaService.pointHistory.create).toHaveBeenCalledWith({
                data: createDto
            });
        });

        it('트랜잭션이 있을 경우 전달된 트랜잭션 객체를 사용해야 한다', async () => {
            // Given
            const createDto = {
                userId: 1,
                points: 10000,
                transactionType: TransactionType.CHARGE
            };

            const mockTx = {
                pointHistory: {
                    create: jest.fn().mockResolvedValue(mockPointHistory)
                }
            };

            // When
            await repository.create(createDto, mockTx);

            // Then
            expect(mockTx.pointHistory.create).toHaveBeenCalledWith({
                data: createDto
            });
            expect(prismaService.pointHistory.create).not.toHaveBeenCalled();
        });
    });
});