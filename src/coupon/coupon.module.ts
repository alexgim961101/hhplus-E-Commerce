import { Module } from "@nestjs/common";
import { CouponController } from "./presentation/controller/coupon.controller";

@Module({
    controllers: [CouponController],
})
export class CouponModule {}
