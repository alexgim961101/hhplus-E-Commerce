import { BadRequestException, Injectable } from "@nestjs/common";
import { OrderService } from "../../domain/service/order.service";
import { OrderProductReqDto } from "../../presentation/dto/order-product.req.dto";
import { OrderProductItemRespDto, OrderProductRespDto } from "../../presentation/dto/order-product.resp.dto";
import { ProductService } from "../../../../src/product/domain/service/product.service";
import { CouponService } from "../../../../src/coupon/domain/service/coupon.service";
import { DiscountType, OrderStatus, Product } from "@prisma/client";
import { PrismaService } from "../../../../src/prisma/prisma.service";

@Injectable()
export class OrderFacadeService {

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
        const result = await this.productService.processOrderProduct(
          item.productId,
          item.amount,
          tx
        );
        processedProducts.push(result);
        totalSum += result.sum;
      }

      const discountAmount = await this.couponService.processCouponDiscount({
        couponId: orderProductReqDto.couponId,
        userId: orderProductReqDto.userId,
        totalAmount: totalSum,
        tx
      });

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