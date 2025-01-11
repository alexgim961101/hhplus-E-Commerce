import { Test, TestingModule } from '@nestjs/testing';
import { CouponFacadeService } from '@/coupon/application/coupon.facade.service';
import { CouponService } from '@/coupon/domain/service/coupon.service';
import { UserService } from '@/user/domain/user.service';
import { PrismaService } from '@/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

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

            const mockUser = {
                id: 1,
                points: 1000,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const mockCoupon = {
                id: 1,
                title: '테스트 쿠폰',
                description: '테스트 쿠폰입니다',
                discountType: 'PERCENTAGE' as const,
                discountAmount: 10,
                validFrom: new Date(),
                validTo: new Date(),
                maxCount: 100,
                currentCount: 50,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const mockIssuedCoupon = {
                ...mockCoupon,
                currentCount: 51
            };

            const mockCouponHistory = {
                id: 1,
                userId: 1,
                couponId: 1,
                isUsed: false,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            jest.spyOn(userService, 'getUser').mockResolvedValue(mockUser);
            jest.spyOn(couponService, 'getCoupon').mockResolvedValue(mockCoupon);
            jest.spyOn(couponService, 'issueCoupon').mockResolvedValue(mockIssuedCoupon);
            jest.spyOn(couponService, 'saveCouponHistory').mockResolvedValue(mockCouponHistory);
            // When
            const result = await facadeService.issueCoupon(userId, couponId);

            // Then
            expect(result.issuedCoupon).toBeDefined();
            expect(result.couponHistory).toBeDefined();
            expect(result.couponHistory.userId).toBe(userId);
            expect(result.couponHistory.couponId).toBe(couponId);
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

            const mockUser = {
                id: 1,
                points: 1000,
                createdAt: new Date(),
                updatedAt: new Date()
            };

            const mockCoupon = {
                id: 1,
                title: '테스트 쿠폰',
                description: '테스트 쿠폰입니다',
                discountType: 'PERCENTAGE' as const,
                discountAmount: 10,
                validFrom: new Date(),
                validTo: new Date(),
                maxCount: 100,
                currentCount: 100,  // 품절 상태
                createdAt: new Date(),
                updatedAt: new Date()
            };

            jest.spyOn(userService, 'getUser').mockResolvedValue(mockUser);
            jest.spyOn(couponService, 'getCoupon').mockResolvedValue(mockCoupon);
            // When
            const result = await facadeService.issueCoupon(userId, couponId);

            // Then
            expect(result.issuedCoupon).toBeNull();
            expect(result.couponHistory).toBeNull();
        });
    });
}); 