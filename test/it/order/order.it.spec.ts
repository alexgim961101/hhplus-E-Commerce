import { Test, TestingModule } from '@nestjs/testing';
import { OrderFacadeService } from '../../../src/order/application/facade/order.facade.service';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { OrderModule } from '../../../src/order/order.module';
import { CouponModule } from '../../../src/coupon/coupon.module';
import { PrismaModule } from '../../../src/prisma/prisma.module';
import { ProductModule } from '../../../src/product/product.module';

describe('상품 주문 통합 테스트', () => {
  let orderFacadeService: OrderFacadeService;
  let prisma: PrismaService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [OrderModule, ProductModule, CouponModule, PrismaModule]
    }).compile();

    orderFacadeService = module.get<OrderFacadeService>(OrderFacadeService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    // 테스트 데이터 초기화
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
    await prisma.coupon.deleteMany();

    // 테스트용 상품 데이터 생성
    await prisma.product.create({
      data: {
        id: 1,
        name: '테스트 상품',
        price: 10000,
        stock: 10,
        description: '테스트 상품입니다.'
      }
    });

    // 테스트용 사용자 생성
    await prisma.user.create({
      data: {
        id: 1,
        points: 1000000
      }
    });

    // 테스트용 쿠폰 생성
    await prisma.coupon.create({
      data: {
        id: 1,
        title: '10% 할인 쿠폰',
        description: '모든 상품 10% 할인',
        discountType: 'PERCENTAGE',
        discountAmount: 10,
        maxCount: 100,
        currentCount: 0,
        validFrom: new Date(),
        validTo: new Date('2024-12-31')
      }
    });
  });

  afterEach(async () => {
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS "OrderDetail"');
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS "Order"');
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS "CouponHistory"');
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS "Coupon"');
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS "Product"');
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS "User"');
  });

  describe('동시성 테스트', () => {
    it('재고가 10개인 상품을 5개씩 3번 동시에 주문하면 하나는 실패해야 한다', async () => {
      // Given
      const orderRequest = {
        userId: 1,
        products: [{ productId: 1, amount: 5 }]
      };

      const requests = 3;
      
      // When
      const promises = Array(requests).fill(null)
        .map(() => orderFacadeService.orderProduct(orderRequest));

      const results = await Promise.allSettled(promises);

      // Then
      const successOrders = results.filter(
        result => result.status === 'fulfilled'
      ).length;

      const failedOrders = results.filter(
        result => result.status === 'rejected'
      ).length;

      expect(successOrders).toBe(2);
      expect(failedOrders).toBe(1);

      // 재고 확인
      const finalProduct = await prisma.product.findUnique({
        where: { id: 1 }
      });
      expect(finalProduct.stock).toBe(0);
    });

    it('동시에 같은 쿠폰을 사용한 주문이 들어와도 정상적으로 처리되어야 한다', async () => {
      // Given
      const orderRequest = {
        userId: 1,
        couponId: 1,
        products: [{ productId: 1, amount: 1 }]
      };

      const requests = 2;

      // When
      const promises = Array(requests).fill(null)
        .map(() => orderFacadeService.orderProduct(orderRequest));

      const results = await Promise.allSettled(promises);

      // Then
      const successOrders = results.filter(
        result => result.status === 'fulfilled'
      ).length;

      expect(successOrders).toBe(2);

      // 쿠폰 사용 횟수 확인
      const finalCoupon = await prisma.coupon.findUnique({
        where: { id: 1 }
      });
      expect(finalCoupon.currentCount).toBe(2);
    });
  });
});