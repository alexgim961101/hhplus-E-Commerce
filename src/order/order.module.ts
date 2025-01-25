import { Module } from "@nestjs/common";
import { OrderController } from "@/order/presentation/controller/order.controller";
import { ORDER_REPOSITORY } from "@/order/domain/repository/order.repository";
import { OrderPrismaRepository } from "@/order/infra/repository/order.prisma.repository";
import { OrderService } from "@/order/domain/service/order.service";
import { OrderFacadeService } from "@/order/application/facade/order.facade.service";
import { ProductModule } from "@/product/product.module";
import { CouponModule } from "@/coupon/coupon.module";
import { ORDER_PRODUCT_REPOSITORY } from "@/order/domain/repository/order-product.repository";
import { OrderProductPrismaRepository } from "@/order/infra/repository/order-product.prisma.repository";
import { LockModule } from "@/common/lock/lock.module";
import { RedlockService } from "@/common/lock/redlock.service";


@Module({
  imports: [ProductModule, CouponModule, LockModule],
  providers: [
    OrderService,
    OrderFacadeService,
    RedlockService,
    {
      provide: ORDER_REPOSITORY,
      useClass: OrderPrismaRepository,
    },
    {
      provide: ORDER_PRODUCT_REPOSITORY,
      useClass: OrderProductPrismaRepository,
    }
  ],
  controllers: [OrderController],
  exports: [OrderFacadeService, OrderService],
})
export class OrderModule {}