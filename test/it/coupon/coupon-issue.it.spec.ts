import { Test, TestingModule } from '@nestjs/testing';
import { CouponFacadeService } from '@/coupon/application/coupon.facade.service';
import { PrismaService } from '@/prisma/prisma.service';
import { CouponModule } from '@/coupon/coupon.module';
import { UserModule } from '@/user/user.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { Logger } from '@nestjs/common';
import { createTable } from '../../common/create-table';
import { insertData } from '../../common/insert-data';
import { deleteTable } from '../../common/delete-table';

describe('쿠폰 발급 통합 테스트', () => {
    let couponFacadeService: CouponFacadeService;
    let prisma: PrismaService;
    let module: TestingModule;

    beforeAll(async () => {
        module = await Test.createTestingModule({
            imports: [CouponModule, UserModule, PrismaModule]
        }).compile();
        module.useLogger(new Logger());
        couponFacadeService = module.get<CouponFacadeService>(CouponFacadeService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    beforeEach(async () => {
        // 테이블 생성 SQL 실행
        await createTable(prisma);

        // 초기 데이터 삽입 SQL 실행
        await insertData(prisma);
    });

    afterEach(async () => {
        // 테이블 삭제
        await deleteTable(prisma);
    });

    afterAll(async () => {
        await module.close();
    });

    describe('issueCoupon', () => {
        it('쿠폰 발급이 성공적으로 이루어져야 한다', async () => {
            // Given
            const userId = 1;
            const couponId = 1;

            // When
            const result = await couponFacadeService.issueCoupon(userId, couponId);

            console.log(result);

            // Then
            expect(result.issuedCoupon).toBeDefined();
            expect(result.couponHistory).toBeDefined();
            expect(result.couponHistory.userId).toBe(userId);
            expect(result.couponHistory.couponId).toBe(couponId);
            expect(result.couponHistory.isUsed).toBe(false);
        });

        it('존재하지 않는 사용자의 경우 예외가 발생해야 한다', async () => {
            // Given
            const userId = 999;
            const couponId = 4;

            // When & Then
            await expect(couponFacadeService.issueCoupon(userId, couponId))
                .rejects
                .toThrow();
        });

        it('품절된 쿠폰의 경우 발급되지 않아야 한다', async () => {
            // Given
            const userId = 1;
            const couponId = 6; // 품절된 쿠폰 ID

            // When
            const result = await couponFacadeService.issueCoupon(userId, couponId);

            // Then
            expect(result.issuedCoupon).toBeNull();
            expect(result.couponHistory).toBeNull();
        });

        describe('동시성 테스트', () => {
            it('동시에 여러 요청이 들어와도 정확한 수량만큼만 발급되어야 한다', async () => {
                // Given
                const userId = 1;
                const couponId = 2; // 500명 중 현재 100명이 신청한 한정 쿠폰 ID
                const requests = 200;

                // When
                const promises = Array(requests).fill(null)
                    .map(() => couponFacadeService.issueCoupon(userId, couponId));

                const results = await Promise.all(promises);

                // Then
                const successfulIssues = results.filter(
                    result => result.issuedCoupon !== null
                ).length;

                expect(successfulIssues).toBe(200);

                const finalCouponState = await prisma.coupon.findUnique({
                    where: { id: couponId }
                });
                expect(finalCouponState.currentCount).toBe(300);
            });
        });
    });
}); 