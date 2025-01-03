import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateOrderDto } from "../dto/create-order.dto";
import { ProductDto } from "../../product/dto/product.dto";
import { CouponDto } from "../../coupon/dto/coupon.dto";

@ApiTags("Order")
@Controller("orders")
export class OrderController {
  private orders: Map<string, any> = new Map();
  private products: Map<number, ProductDto>;
  private userCoupons: Map<number, CouponDto[]>;
  private orderLocks: Set<number> = new Set(); // 동시성 제어를 위한 락

  constructor() {
    // Mock 데이터 초기화
    this.products = new Map([
      [1, { id: 1, name: "맥북 프로 16인치", price: 3600000, stock: 100 }],
      [2, { id: 2, name: "아이폰 15 Pro", price: 1600000, stock: 200 }],
    ]);

    this.userCoupons = new Map([
      [
        1,
        [
          {
            id: 1,
            name: "신규 가입 10% 할인 쿠폰",
            startDate: new Date(),
            expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            isAvailable: true,
            usedAt: null,
          },
        ],
      ],
    ]);
  }

  @Post()
  @ApiOperation({ summary: "상품 주문 API" })
  @ApiResponse({
    status: 201,
    description: "주문 성공",
    schema: {
      example: {
        orderId: "order-1",
        userId: 1,
        items: [
          { productId: 1, quantity: 2, price: 3600000 },
          { productId: 2, quantity: 1, price: 1600000 },
        ],
        totalAmount: 8800000,
        discountAmount: 880000,
        finalAmount: 7920000,
        message: "주문이 완료되었습니다.",
      },
    },
  })
  async createOrder(@Body() dto: CreateOrderDto) {
    // 주문 수량 검증
    for (const item of dto.items) {
      if (item.quantity <= 0) {
        throw new HttpException(
          "잘못된 주문 요청입니다.",
          HttpStatus.BAD_REQUEST
        );
      }
    }

    // 재고 검증 및 차감
    const orderItems = [];
    let totalAmount = 0;

    for (const item of dto.items) {
      const product = this.products.get(item.productId);

      if (!product) {
        throw new HttpException(
          "존재하지 않는 상품입니다.",
          HttpStatus.NOT_FOUND
        );
      }

      // 재고 동시성 제어
      if (this.orderLocks.has(item.productId)) {
        throw new HttpException(
          "현재 처리 중인 주문이 있습니다. 잠시 후 다시 시도해주세요.",
          HttpStatus.CONFLICT
        );
      }

      this.orderLocks.add(item.productId);

      try {
        if (product.stock < item.quantity) {
          throw new HttpException("재고가 부족합니다.", HttpStatus.BAD_REQUEST);
        }

        // 재고 차감
        product.stock -= item.quantity;
        this.products.set(item.productId, product);

        // 주문 상품 정보 저장
        orderItems.push({
          productId: item.productId,
          quantity: item.quantity,
          price: product.price,
        });
        totalAmount += product.price * item.quantity;
      } finally {
        this.orderLocks.delete(item.productId);
      }
    }

    // 쿠폰 적용
    let discountAmount = 0;
    if (dto.couponId) {
      const userCoupons = this.userCoupons.get(dto.userId) || [];
      const coupon = userCoupons.find(
        (c) => c.id === dto.couponId && c.isAvailable
      );

      if (!coupon) {
        throw new HttpException(
          "사용 가능한 쿠폰이 아닙니다.",
          HttpStatus.BAD_REQUEST
        );
      }

      // 10% 할인 적용 (실제로는 쿠폰별 할인율이 다를 수 있음)
      discountAmount = Math.floor(totalAmount * 0.1);

      // 쿠폰 사용 처리
      coupon.isAvailable = false;
      coupon.usedAt = new Date();
    }

    const finalAmount = totalAmount - discountAmount;
    const orderId = `order-${Date.now()}`;

    // 주문 정보 저장
    this.orders.set(orderId, {
      orderId,
      userId: dto.userId,
      items: orderItems,
      totalAmount,
      discountAmount,
      finalAmount,
      createdAt: new Date(),
    });

    return {
      orderId,
      userId: dto.userId,
      items: orderItems,
      totalAmount,
      discountAmount,
      finalAmount,
      message: "주문이 완료되었습니다.",
    };
  }
}
