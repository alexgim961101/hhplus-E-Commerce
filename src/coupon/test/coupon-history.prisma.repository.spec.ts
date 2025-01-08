import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { CouponHistoryPrismaRepository } from '../infra/coupon-history.prisma.repository';

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
                }
            ]
        }).compile();

        repository = module.get<CouponHistoryPrismaRepository>(CouponHistoryPrismaRepository);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('findAvailableCouponByUserId', () => {
        it('사용자의 유효한 쿠폰 목록이 정상적으로 조회되어야 한다', async () => {
            // Given
            const userId = 1;
            const page = 1;
            const limit = 10;

            const mockCoupons = [{
                id: 1,
                title: 'Test Coupon',
                description: 'Test Description',
                discountType: 'PERCENTAGE',
                discountAmount: 10,
                validFrom: new Date(),
                validTo: new Date(),
                maxCount: 100,
                currentCount: 50,
                createdAt: new Date(),
                updatedAt: new Date()
            }];

            const mockCount = [{ count: '1' }];

            jest.spyOn(prismaService, '$queryRaw')
                .mockResolvedValueOnce(mockCoupons)
                .mockResolvedValueOnce(mockCount);

            // When
            const result = await repository.findAvailableCouponByUserId(userId, page, limit);

            // Then
            expect(prismaService.$queryRaw).toHaveBeenCalledTimes(2);
            expect(result.coupons).toEqual(mockCoupons);
            expect(result.total).toBe(1);
        });

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