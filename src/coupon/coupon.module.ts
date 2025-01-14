import { Module } from "@nestjs/common";
import { CouponController } from "@/coupon/presentation/controller/coupon.controller";
import { CouponRepository } from "@/coupon/domain/repository/coupon.repository";
import { CouponHistoryRepository } from "@/coupon/domain/repository/coupon-history.repository";
import { CouponHistoryPrismaRepository } from "@/coupon/infra/repository/coupon-history.prisma.repository";
import { CouponService } from "@/coupon/domain/service/coupon.service";
import { UserModule } from "@/user/user.module";
import { CouponFacadeService } from "@/coupon/application/facade/coupon.facade.service";
import { PrismaModule } from "@/prisma/prisma.module";
import { CouponHistoryMapper } from "@/coupon/infra/mapper/coupone-history.mapper";
import { CouponMapper } from "@/coupon/infra/mapper/coupon.mapper";
import { CouponPrismaRepository } from "@/coupon/infra/repository/coupon.prisma.repository";

@Module({
    imports: [
        PrismaModule,
        UserModule
    ],
    providers: [
        {
            provide: CouponRepository,
            useClass: CouponPrismaRepository
        },
        {
            provide: CouponHistoryRepository,
            useClass: CouponHistoryPrismaRepository
        },
        CouponService,
        CouponFacadeService,
        CouponHistoryMapper,
        CouponMapper
    ],
    controllers: [CouponController],
    exports: [CouponService, CouponFacadeService]
})
export class CouponModule {}
