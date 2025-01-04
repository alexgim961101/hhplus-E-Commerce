import { Module } from "@nestjs/common";
import { PointController } from "./presentation/point/controller/point.controller";
import { CouponController } from "./presentation/coupon/controller/coupon.controller";
import { ProductController } from "./presentation/product/controller/product.controller";
import { PaymentController } from "./presentation/payment/controller/payment.controller";
import { OrderController } from "./presentation/order/controller/order.controller";

@Module({
  imports: [],
  controllers: [
    PointController,
    CouponController,
    ProductController,
    PaymentController,
    OrderController,
  ],
  providers: [],
})
export class AppModule {}
