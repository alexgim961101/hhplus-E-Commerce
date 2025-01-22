import { Test, TestingModule } from '@nestjs/testing';
import { CouponFacadeService } from '@/coupon/application/facade/coupon.facade.service';
import { CouponService } from '@/coupon/domain/service/coupon.service';
import { UserService } from '@/user/domain/service/user.service';
import { PrismaService } from '@/prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserModel } from '@/user/domain/model/user.model';
import { CouponModel, DiscountType } from '@/coupon/domain/model/coupon';
import { CouponHistoryModel } from '@/coupon/domain/model/coupon-history';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from '@/common/logger/winston.config';

describe('CouponFacadeService', () => {
    let facadeService: CouponFacadeService;
    let couponService: CouponService;
    let userService: UserService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [WinstonModule.forRoot(winstonConfig)],
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

        it('품절된 쿠폰의 경우 BadRequestException을 던져야 한다', async () => {
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

            // When & Then
            await expect(facadeService.issueCoupon(userId, couponId))
                .rejects
                .toThrow(BadRequestException);
        });
    });
}); 