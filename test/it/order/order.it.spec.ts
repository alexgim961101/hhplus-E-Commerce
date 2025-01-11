import { Test, TestingModule } from '@nestjs/testing';
import { OrderFacadeService } from '@/order/application/facade/order.facade.service';
import { PrismaService } from '@/prisma/prisma.service';
import { OrderModule } from '@/order/order.module';
import { CouponModule } from '@/coupon/coupon.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { ProductModule } from '@/product/product.module';
import * as fs from 'fs';
import * as path from 'path';

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
    // 테이블 생성 SQL 실행
    const createTableSQL = fs.readFileSync(
        path.join(__dirname, '../../it/create-table.sql'),
        'utf8'
    );
    for (const sql of createTableSQL.split(";").filter((s) => s.trim() !== "")) {
        await prisma.$executeRawUnsafe(sql);
    }

    // 초기 데이터 삽입 SQL 실행
    const importSQL = fs.readFileSync(
        path.join(__dirname, '../../it/import.sql'),
        'utf8'
    );
    for (const sql of importSQL.split(";").filter((s) => s.trim() !== "")) {
        await prisma.$executeRawUnsafe(sql);
    }
  });

  afterEach(async () => {
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS OrderDetail');
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS Orders');
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS CouponHistory');
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS Coupon');
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS Product');
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS User');
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