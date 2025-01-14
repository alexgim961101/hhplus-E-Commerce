import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { CouponHistoryPrismaRepository } from '../infra/repository/coupon-history.prisma.repository';
import { CouponHistoryMapper } from '../infra/mapper/coupone-history.mapper';
import { CouponMapper } from '../infra/mapper/coupon.mapper';

describe('CouponHistoryPrismaRepository', () => {
    let repository: CouponHistoryPrismaRepository;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CouponHistoryPrismaRepository,
                {
                    provide: PrismaService,
                    useValue: {
                        $queryRaw: jest.fn()
                    }
                },
                {
                    provide: CouponHistoryMapper,
                    useValue: {
                        toDomainList: jest.fn()
                    }
                },
                {
                    provide: CouponMapper,
                    useValue: {
                        toDomainList: jest.fn()
                    }
                }
            ]
        }).compile();

        repository = module.get<CouponHistoryPrismaRepository>(CouponHistoryPrismaRepository);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('findAvailableCouponByUserId', () => {
        it('트랜잭션이 전달된 경우 해당 트랜잭션을 사용해야 한다', async () => {
            // Given
            const userId = 1;
            const page = 1;
            const limit = 10;
            const mockTx = {
                $queryRaw: jest.fn()
                    .mockResolvedValueOnce([])
                    .mockResolvedValueOnce([{ count: '0' }])
            };

            // When
            await repository.findAvailableCouponByUserId(userId, page, limit, mockTx);

            // Then
            expect(mockTx.$queryRaw).toHaveBeenCalledTimes(2);
            expect(prismaService.$queryRaw).not.toHaveBeenCalled();
        });
    });
}); 