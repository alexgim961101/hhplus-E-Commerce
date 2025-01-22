import { Test, TestingModule } from '@nestjs/testing';
import { CouponFacadeService } from '@/coupon/application/facade/coupon.facade.service';
import { PrismaService } from '@/prisma/prisma.service';
import { CouponModule } from '@/coupon/coupon.module';
import { UserModule } from '@/user/user.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { UserService } from '@/user/domain/service/user.service';
import { CreateUserReqDto } from '@/user/presentation/dto/request/create-user-req.dto';
import { DiscountType } from '@prisma/client';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from '@/common/logger/winston.config';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('쿠폰 발급 통합 테스트', () => {
    let userService: UserService;
    let couponFacadeService: CouponFacadeService;
    let prisma: PrismaService;
    let module: TestingModule;

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [UserModule, CouponModule, PrismaModule, WinstonModule.forRoot(winstonConfig)]
        }).compile();

        userService = module.get<UserService>(UserService);
        couponFacadeService = module.get<CouponFacadeService>(CouponFacadeService);
        prisma = module.get<PrismaService>(PrismaService);

        await prisma.user.deleteMany();
        await prisma.coupon.deleteMany();
    });

    describe('issueCoupon', () => {
        it('쿠폰 발급이 성공적으로 이루어져야 한다', async () => {
            // given
            // 1. 사용자 생성
            const user = await userService.createUser(new CreateUserReqDto());

            // 2. 쿠폰 생성
            const coupon = await prisma.coupon.create({
                data: {
                    id: 1,
                    title: 'test coupon',
                    description: 'test',
                    discountType: DiscountType.PERCENTAGE,
                    discountAmount: 10,
                    validFrom: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
                    validTo: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 2),
                    maxCount: 10,
                    currentCount: 0
                }
            })

            // when
            const issuedCoupon = await couponFacadeService.issueCoupon(user.id, coupon.id);

            // then
            expect(issuedCoupon.title).toBe(coupon.title);
            expect(issuedCoupon.currentCount).toBe(1);
        });

        it('존재하지 않는 사용자의 경우 예외가 발생해야 한다', async () => {
            // given
            // 1. 사용자 생성
            const user = await userService.createUser(new CreateUserReqDto());

            // 2. 쿠폰 생성
            const coupon = await prisma.coupon.create({
                data: {
                    id: 1,
                    title: 'test coupon',
                    description: 'test',
                    discountType: DiscountType.PERCENTAGE,
                    discountAmount: 10,
                    validFrom: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
                    validTo: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 2),
                    maxCount: 10,
                    currentCount: 0
                }
            })

            // when && then
            await expect(couponFacadeService.issueCoupon(2, coupon.id)).rejects.toThrow(NotFoundException);
        });

        it('품절된 쿠폰의 경우 발급되지 않아야 한다', async () => {
            // given
            // 1. 사용자 생성
            const user = await userService.createUser(new CreateUserReqDto());

            // 2. 쿠폰 생성
            const coupon = await prisma.coupon.create({
                data: {
                    id: 1,
                    title: 'test coupon',
                    description: 'test',
                    discountType: DiscountType.PERCENTAGE,
                    discountAmount: 10,
                    validFrom: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
                    validTo: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 2),
                    maxCount: 10,
                    currentCount: 10
                }
            })

            // when && then
            await expect(couponFacadeService.issueCoupon(user.id, coupon.id)).rejects.toThrow(BadRequestException);
        });

        describe('동시성 테스트', () => {
            it('동시에 여러 요청이 들어와도 정확한 수량만큼만 발급되어야 한다', async () => {
                // given
                const user = await userService.createUser(new CreateUserReqDto());

                const coupon = await prisma.coupon.create({
                    data: {
                        id: 1,
                        title: 'test coupon',
                        description: 'test',
                        discountType: DiscountType.PERCENTAGE,
                        discountAmount: 10,
                        validFrom: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
                        validTo: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30 * 2),
                        maxCount: 10,
                        currentCount: 5
                    }
                })

                // when
                await Promise.all([
                    couponFacadeService.issueCoupon(user.id, coupon.id),
                    couponFacadeService.issueCoupon(user.id, coupon.id),
                    couponFacadeService.issueCoupon(user.id, coupon.id)
                ]);

                

                // then
                const issuedCoupon = await prisma.coupon.findUnique({
                    where: { id: coupon.id }
                });
                expect(issuedCoupon.currentCount).toBe(8);
            });
        });
    });
}); 