import { Test, TestingModule } from '@nestjs/testing';
import { CouponController } from '../presentation/controller/coupon.controller';
import { CouponService } from '../domain/service/coupon.service';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { DiscountType } from '@prisma/client';
import { CouponFacadeService } from '../application/coupon.facade.service';

describe('CouponController', () => {
    let controller: CouponController;
    let couponService: CouponService;
    let couponFacadeService: CouponFacadeService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CouponController],
            providers: [
                {
                    provide: CouponService,
                    useValue: {
                        getCouponList: jest.fn()
                    }
                },
                {
                    provide: CouponFacadeService,
                    useValue: {
                        issueCoupon: jest.fn()
                    }
                }
            ]
        }).compile();

        controller = module.get<CouponController>(CouponController);
        couponService = module.get<CouponService>(CouponService);
        couponFacadeService = module.get<CouponFacadeService>(CouponFacadeService);
    });

    describe('getCouponList', () => {
        it('사용자의 보유 쿠폰 목록이 정상적으로 조회되어야 한다', async () => {
            // Given
            const userId = 1;
            const query: PaginationQueryDto = {
                page: 1,
                limit: 10
            };

            const mockResponse = {
                coupons: [
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
                        updatedAt: new Date()
                    }
                ],
                totalPage: 1,
                currentPage: 1,
                totalCount: 1
            };

            jest.spyOn(couponService, 'getCouponList').mockResolvedValue(mockResponse);

            // When
            const result = await controller.getCouponList(query, userId);

            // Then
            expect(couponService.getCouponList).toHaveBeenCalledWith(userId, query.page, query.limit);
            expect(result).toEqual(mockResponse);
            expect(result.coupons).toHaveLength(1);
            expect(result.totalPage).toBe(1);
            expect(result.currentPage).toBe(1);
            expect(result.totalCount).toBe(1);
        });
    });
}); 