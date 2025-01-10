import { Module } from "@nestjs/common";
import { OrderController } from "./presentation/controller/order.controller";
import { ORDER_REPOSITORY } from "./domain/repository/order.repository";
import { OrderPrismaRepository } from "./infra/repository/order.prisma.repository";
import { OrderService } from "./domain/service/order.service";
import { OrderFacadeService } from "./application/facade/order.facade.service";
import { ProductModule } from "../product/product.module";
import { CouponService } from "../coupon/domain/service/coupon.service";
import { CouponModule } from "../coupon/coupon.module";

@Module({
  imports: [ProductModule, CouponModule],
  providers: [
    OrderService,
    OrderFacadeService,
    {
      provide: ORDER_REPOSITORY,
      useClass: OrderPrismaRepository,
    },
  ],
  controllers: [OrderController],
  exports: [OrderFacadeService, OrderService],
})
export class OrderModule {}