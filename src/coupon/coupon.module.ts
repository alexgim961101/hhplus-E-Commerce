import { Module } from "@nestjs/common";
import { CouponController } from "@/coupon/presentation/controller/coupon.controller";
import { CouponRepository } from "@/coupon/domain/repository/coupon.repository";
import { CouponPrismaRepository } from "@/coupon/infra/coupon.prisma.repository";
import { CouponHistoryRepository } from "@/coupon/domain/repository/coupon-history.repository";
import { CouponHistoryPrismaRepository } from "@/coupon/infra/coupon-history.prisma.repository";
import { CouponService } from "@/coupon/domain/service/coupon.service";
import { UserModule } from "@/user/user.module";
import { CouponFacadeService } from "@/coupon/application/coupon.facade.service";
import { PrismaModule } from "@/prisma/prisma.module";

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
    ],
    controllers: [CouponController],
    exports: [CouponService, CouponFacadeService]
})
export class CouponModule {}
