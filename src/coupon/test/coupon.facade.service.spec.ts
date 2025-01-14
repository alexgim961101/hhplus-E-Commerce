import { Test, TestingModule } from '@nestjs/testing';
import { CouponFacadeService } from '@/coupon/application/facade/coupon.facade.service';
import { CouponService } from '@/coupon/domain/service/coupon.service';
import { UserService } from '@/user/domain/service/user.service';
import { PrismaService } from '@/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { UserModel } from '@/user/domain/model/user.model';
import { CouponModel, DiscountType } from '@/coupon/domain/model/coupon';
import { CouponHistoryModel } from '@/coupon/domain/model/coupon-history';

describe('CouponFacadeService', () => {
    let facadeService: CouponFacadeService;
    let couponService: CouponService;
    let userService: UserService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CouponFacadeService,
                {
                    provide: CouponService,
                    useValue: {
                        getCoupon: jest.fn(),
                        issueCoupon: jest.fn(),
                        saveCouponHistory: jest.fn()
                    }
                },
                {
                    provide: UserService,
                    useValue: {
                        getUser: jest.fn(),
                        getUserWithLock: jest.fn()
                    }
                },
                {
                    provide: PrismaService,
                    useValue: {
                        runInTransaction: jest.fn((callback) => callback())
                    }
                }
            ]
        }).compile();

        facadeService = module.get<CouponFacadeService>(CouponFacadeService);
        couponService = module.get<CouponService>(CouponService);
        userService = module.get<UserService>(UserService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    describe('issueCoupon', () => {
        it('쿠폰 발급이 성공적으로 이루어져야 한다', async () => {
            // Given
            const userId = 1;
            const couponId = 1;

            const mockUser: UserModel = {
                id: 1,
                points: 1000,
                createdAt: new Date(),
                updatedAt: new Date(),
                usePoint: jest.fn(),
                chargePoint: jest.fn()
            };

            const mockCoupon: CouponModel = {
                id: 1,
                title: '테스트 쿠폰',
                description: '테스트 쿠폰입니다',
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
            };

            const mockIssuedCoupon: CouponModel = {
                id: 1,
                title: '테스트 쿠폰',
                description: '테스트 쿠폰입니다',
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
            };

            const mockCouponHistory: CouponHistoryModel = {
                id: 1,
                userId: 1,
                couponId: 1,
                isUsed: false,
                createdAt: new Date(),
                updatedAt: new Date(),
                useCoupon: jest.fn()
            };

            jest.spyOn(userService, 'getUser').mockResolvedValue(mockUser);
            jest.spyOn(couponService, 'getCoupon').mockResolvedValue(mockCoupon);
            jest.spyOn(couponService, 'issueCoupon').mockResolvedValue(mockIssuedCoupon);
            jest.spyOn(couponService, 'saveCouponHistory').mockResolvedValue(mockCouponHistory);

            // When
            const result = await facadeService.issueCoupon(userId, couponId);

            // Then
            expect(result).toBeDefined();
            expect(result.id).toBe(mockIssuedCoupon.id);
            expect(result.title).toBe(mockIssuedCoupon.title);
            expect(result.description).toBe(mockIssuedCoupon.description);
            expect(result.discountType).toBe(mockIssuedCoupon.discountType);
            expect(result.discountAmount).toBe(mockIssuedCoupon.discountAmount);
            expect(result.validFrom).toBe(mockIssuedCoupon.validFrom);
            expect(result.validTo).toBe(mockIssuedCoupon.validTo);
            expect(result.maxCount).toBe(mockIssuedCoupon.maxCount);
            expect(result.currentCount).toBe(mockIssuedCoupon.currentCount);
        });

        it('존재하지 않는 사용자의 경우 예외가 발생해야 한다', async () => {
            // Given
            const userId = 999;
            const couponId = 1;

            jest.spyOn(userService, 'getUser').mockRejectedValue(new NotFoundException('User not found'));

            // When & Then
            await expect(facadeService.issueCoupon(userId, couponId))
                .rejects
                .toThrow(NotFoundException);
        });

        it('품절된 쿠폰의 경우 null을 반환해야 한다', async () => {
            // Given
            const userId = 1;
            const couponId = 1;

            const mockUser: UserModel = {
                id: userId,
                points: 1000,
                createdAt: new Date(),
                updatedAt: new Date(),
                usePoint: jest.fn(),
                chargePoint: jest.fn()
            };

            const mockCoupon: CouponModel = {
                id: couponId,
                title: '테스트 쿠폰',
                description: '테스트 쿠폰입니다',
                discountType: DiscountType.PERCENTAGE,
                discountAmount: 10,
                validFrom: new Date(),
                validTo: new Date(),
                maxCount: 100,
                currentCount: 100,  // 품절 상태
                createdAt: new Date(),
                updatedAt: new Date(),
                checkCouponDateValidity: jest.fn(),
                issueCoupon: jest.fn(),
                checkCouponCountValidity: jest.fn()
            };

            jest.spyOn(userService, 'getUser').mockResolvedValue(mockUser);
            jest.spyOn(couponService, 'getCoupon').mockResolvedValue(mockCoupon);
            // When
            const result = await facadeService.issueCoupon(userId, couponId);

            // Then
            expect(result).toBeNull();
            expect(couponService.issueCoupon).not.toHaveBeenCalled();
            expect(couponService.saveCouponHistory).not.toHaveBeenCalled();
        });
    });
}); 