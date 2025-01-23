import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { OrderService } from "@/order/domain/service/order.service";
import { ProductService } from "@/product/domain/service/product.service";
import { CouponService } from "@/coupon/domain/service/coupon.service";
import { PrismaService } from "@/prisma/prisma.service";
import { OrderProductReqDto } from "@/order/presentation/dto/request/order-product.dto";
import { OrderStatus } from "@/order/domain/model/order";
import { OrderProductRespDto } from "@/order/presentation/dto/response/order-product.dto";
import { DistributedLock } from "@/common/lock/distributed-lock.decorator";
import { LockService } from "@/common/lock/lock.service";

@Injectable()
export class OrderFacadeService {

  private readonly logger = new Logger(OrderFacadeService.name);

  constructor(
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
    private readonly couponService: CouponService,
    private readonly prisma: PrismaService,
    private readonly lockService: LockService
  ) {}

  async orderProduct(orderProductReqDto: OrderProductReqDto): Promise<OrderProductRespDto> {

    let lock: string | null = null;
    try {
      lock = await this.lockService.acquireLockWithWait('lock:product', 30, 10000);
      return this.prisma.runInTransaction(async (tx) => {
        let subTotalPrice = 0;
      let discountAmount = 0;

      // 주문한 상품들에 대한 정보 가져오기
      const productList = await Promise.all(orderProductReqDto.products.map(async (product) => {
        const orderProduct = await this.productService.getProductWithModel(product.productId, tx);
        await this.productService.decreaseStock(orderProduct, product.amount, tx);

        // 전체 가격 확인
        const totalPrice = orderProduct.price * product.amount;
        subTotalPrice += totalPrice;

        return {
          productId: orderProduct.id,
          amount: product.amount,
          price: orderProduct.price,
          totalPrice: totalPrice
        };
      })).catch((error) => {
        this.logger.error(`Order product failed: ${error}`);
        throw new BadRequestException('상품 주문에 실패했습니다.');
      });

      // 쿠폰 적용 여부 확인
      if (orderProductReqDto.couponId) {
        const coupon = await this.couponService.getCoupon(orderProductReqDto.couponId, tx);
        const couponHistory = await this.couponService.getCouponHistory(coupon.id, orderProductReqDto.userId, tx);
        
        if (!coupon.checkCouponDateValidity(new Date())) {
          throw new BadRequestException('쿠폰이 만료되었습니다.');
        }

        // 쿠폰 적용 여부에 따라 쿠폰 적용 (금액 차감)
        discountAmount = this.couponService.calculateDiscountAmount(coupon, subTotalPrice);
      }

      // 주문 생성
      const order = await this.orderService.createOrder({
        userId: orderProductReqDto.userId,
        orderSubtotal: subTotalPrice,
        discount: discountAmount,
        orderTotal: subTotalPrice - discountAmount,
        couponId: orderProductReqDto.couponId || null,
        orderStatus: OrderStatus.PENDING
      }, tx);

      // 주문 상품 생성
      await Promise.all(productList.map(async (product) => {
        await this.orderService.createOrderProduct({
          orderId: order.id,
          productId: product.productId,
          quantity: product.amount,
          itemTotal: product.totalPrice
        }, tx);
      }));

      return {
        orderId: order.id,
        products: productList,
        sum: subTotalPrice,
        discount: discountAmount,
          total: subTotalPrice - discountAmount
        }
      });
    } catch (error) {
      throw new BadRequestException('상품 주문에 실패했습니다.');
    } finally {
      await this.lockService.releaseLock('lock:product', lock);
    }
  }
}
