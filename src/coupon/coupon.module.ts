import { Module } from "@nestjs/common";
import { CouponController } from "./presentation/controller/coupon.controller";
import { CouponRepository } from "./domain/repository/coupon.repository";
import { CouponPrismaRepository } from "./infra/coupon.prisma.repository";
import { CouponHistoryRepository } from "./domain/repository/coupon-history.repository";
import { CouponHistoryPrismaRepository } from "./infra/coupon-history.prisma.repository";
import { CouponService } from "./domain/service/coupon.service";

@Module({
    providers: [
        {
            provide: CouponRepository,
            useClass: CouponPrismaRepository
        },
        {
            provide: CouponHistoryRepository,
            useClass: CouponHistoryPrismaRepository
        },
        CouponService 
    ],
    controllers: [CouponController],
})
export class CouponModule {}
