import { Module } from "@nestjs/common";
import { CouponController } from "./presentation/controller/coupon.controller";
import { CouponRepository } from "./domain/repository/coupon.repository";
import { CouponPrismaRepository } from "./infra/coupon.prisma.repository";
import { CouponHistoryRepository } from "./domain/repository/coupon-history.repository";
import { CouponHistoryPrismaRepository } from "./infra/coupon-history.prisma.repository";
import { CouponService } from "./domain/service/coupon.service";
import { UserModule } from "../user/user.module";
import { CouponFacadeService } from "./application/coupon.facade.service";
import { PrismaModule } from '../prisma/prisma.module';

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
