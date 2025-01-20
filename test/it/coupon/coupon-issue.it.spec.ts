import { Test, TestingModule } from '@nestjs/testing';
import { CouponFacadeService } from '@/coupon/application/facade/coupon.facade.service';
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
        it('쿠폰 발급이 성공적으로 이루어져야 한다', async () => {});

        it('존재하지 않는 사용자의 경우 예외가 발생해야 한다', async () => {});

        it('품절된 쿠폰의 경우 발급되지 않아야 한다', async () => {});

        describe('동시성 테스트', () => {
            it('동시에 여러 요청이 들어와도 정확한 수량만큼만 발급되어야 한다', async () => {});
        });
    });
}); 