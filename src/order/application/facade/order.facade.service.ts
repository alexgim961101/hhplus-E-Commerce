import { Injectable, Logger } from "@nestjs/common";
import { OrderService } from "@/order/domain/service/order.service";
import { OrderProductReqDto } from "@/order/presentation/dto/order-product.req.dto";
import { OrderProductRespDto } from "@/order/presentation/dto/order-product.resp.dto";
import { ProductService } from "@/product/domain/service/product.service";
import { CouponService } from "@/coupon/domain/service/coupon.service";
import { PrismaService } from "@/prisma/prisma.service";

@Injectable()
export class OrderFacadeService {

  private readonly logger = new Logger(OrderFacadeService.name);

  constructor(
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
    private readonly couponService: CouponService,
    private readonly prisma: PrismaService
  ) {}

  async orderProduct(orderProductReqDto: OrderProductReqDto): Promise<OrderProductRespDto> {
    return this.prisma.runInTransaction(async (tx) => {
      const processedProducts = [];
      let totalSum = 0;

      for (const item of orderProductReqDto.products) {
        const product = await this.productService.getProductWithLock(item.productId, tx);
        product.decreaseStock(item.amount);
        await this.productService.decreaseStock(product, item.amount, tx);
        processedProducts.push({
          productId: product.id,
          amount: item.amount,
          price: product.price,
          sum: product.price * item.amount
        });
        totalSum += product.price * item.amount;
      }

      let discountAmount = 0;
      if (orderProductReqDto.couponId) {
        const coupon = await this.couponService.getCouponWithLock(orderProductReqDto.couponId, tx);
        const couponHistory = await this.couponService.getCouponHistory(orderProductReqDto.couponId, orderProductReqDto.userId, tx);
        await this.couponService.validateCoupon(coupon, couponHistory);
        discountAmount = this.couponService.calculateDiscountAmount(coupon, totalSum);
        await this.couponService.useCoupon(couponHistory.id, tx);
      }



      const { finalAmount } = await this.orderService.createOrderWithDetails({
        userId: orderProductReqDto.userId,
        products: processedProducts,
        totalSum,
        discountAmount,
        couponId: orderProductReqDto.couponId
      }, tx);

      return {
        products: processedProducts.map(p => ({
          productId: p.productId,
          amount: p.amount
        })),
        sum: totalSum,
        discount: discountAmount,
        total: finalAmount
      };
    });
  }
}