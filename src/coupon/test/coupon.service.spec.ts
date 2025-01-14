import { Test, TestingModule } from '@nestjs/testing';
import { CouponService } from '@/coupon/domain/service/coupon.service';
import { CouponRepository } from '@/coupon/domain/repository/coupon.repository';
import { CouponHistoryRepository } from '@/coupon/domain/repository/coupon-history.repository';
import { CouponModel, DiscountType } from '@/coupon/domain/model/coupon';

describe('CouponService', () => {
    let service: CouponService;
    let couponHistoryRepository: CouponHistoryRepository;
    let couponRepository: CouponRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CouponService,
                {
                    provide: CouponHistoryRepository,
                    useValue: {
                        findAvailableCouponByUserId: jest.fn(),
                        save: jest.fn()
                    }
                },
                {
                    provide: CouponRepository,
                    useValue: {
                        findById: jest.fn(),
                        save: jest.fn()
                    }
                }
            ]
        }).compile();

        service = module.get<CouponService>(CouponService);
        couponHistoryRepository = module.get<CouponHistoryRepository>(CouponHistoryRepository);
        couponRepository = module.get<CouponRepository>(CouponRepository);
    });

    describe('getCouponList', () => {
        it('사용 가능한 쿠폰 목록이 정상적으로 조회되어야 한다', async () => {
            // Given
            const userId = 1;
            const page = 1;
            const limit = 10;
            
            const mockCoupons: CouponModel[] = [
                {
                    id: 1,
                    title: 'Test Coupon',
                    description: 'Test Description',
                    discountType: DiscountType.PERCENTAGE,
                    discountAmount: 10,
                    validFrom: new Date(),
                    validTo: new Date(),
                    maxCount: 100,
                    currentCount: 50,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    checkCouponDateValidity: jest.fn(),
                    issueCoupon: jest.fn(),
                    checkCouponCountValidity: jest.fn()
                }
            ];

            jest.spyOn(couponHistoryRepository, 'findAvailableCouponByUserId').mockResolvedValue(mockCoupons);

            // When
            const result = await service.getCouponList(userId, page, limit);

            // Then
            expect(couponHistoryRepository.findAvailableCouponByUserId).toHaveBeenCalledWith(userId, page, limit);
            expect(result).toEqual(mockCoupons);
        });

        it('쿠폰이 없을 경우 빈 배열을 반환해야 한다', async () => {
            // Given
            const userId = 1;
            const page = 1;
            const limit = 10;

            jest.spyOn(couponHistoryRepository, 'findAvailableCouponByUserId').mockResolvedValue([]);

            // When
            const result = await service.getCouponList(userId, page, limit);

            // Then
            expect(result).toEqual([]);
        });
    });
}); 