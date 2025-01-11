import { Module } from "@nestjs/common";
import { OrderController } from "@/order/presentation/controller/order.controller";
import { ORDER_REPOSITORY } from "@/order/domain/repository/order.repository";
import { OrderPrismaRepository } from "@/order/infra/repository/order.prisma.repository";
import { OrderService } from "@/order/domain/service/order.service";
import { OrderFacadeService } from "@/order/application/facade/order.facade.service";
import { ProductModule } from "@/product/product.module";
import { CouponModule } from "@/coupon/coupon.module";

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