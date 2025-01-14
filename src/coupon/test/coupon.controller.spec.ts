import { Test, TestingModule } from '@nestjs/testing';
import { CouponController } from '@/coupon/presentation/controller/coupon.controller';
import { CouponService } from '@/coupon/domain/service/coupon.service';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';
import { CouponFacadeService } from '@/coupon/application/facade/coupon.facade.service';
import { CouponModel, DiscountType } from '@/coupon/domain/model/coupon';

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

            const mockResponse: CouponModel[] = [
                new CouponModel({
                    id: 1,
                    title: 'test',
                    description: 'test',
                    discountType: DiscountType.PERCENTAGE,
                    discountAmount: 10,
                    validFrom: new Date(),
                    validTo: new Date(),
                    maxCount: 100,
                    currentCount: 0
                })
            ]

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