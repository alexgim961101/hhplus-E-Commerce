import { Test, TestingModule } from '@nestjs/testing';
import { OrderFacadeService } from '@/order/application/facade/order.facade.service';
import { PrismaService } from '@/prisma/prisma.service';
import { OrderModule } from '@/order/order.module';
import { CouponModule } from '@/coupon/coupon.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { ProductModule } from '@/product/product.module';
import { createTable } from '../../common/create-table';
import { insertData } from '../../common/insert-data';
import { deleteTable } from '../../common/delete-table';
import { Logger } from '@nestjs/common';
import { UserModel } from '@/user/domain/model/user.model';
import { UserModule } from '@/user/user.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from '@/common/logger/winston.config';
import { UserService } from '@/user/domain/service/user.service';
import { ProductService } from '@/product/domain/service/product.service';
import { CouponService } from '@/coupon/domain/service/coupon.service';
import { OrderService } from '@/order/domain/service/order.service';
import { CreateUserReqDto } from '@/user/presentation/dto/request/create-user-req.dto';
import { OrderProductReqDto } from '@/order/presentation/dto/request/order-product.dto';
import { LockService } from '@/common/lock/lock.service';
import { LockModule } from '@/common/lock/lock.module';
import { RedisModule, RedisService } from '@songkeys/nestjs-redis';
import { RedlockService } from '@/common/lock/redlock.service';


describe('상품 주문 통합 테스트', () => {
  let orderFacadeService: OrderFacadeService;
  let orderService: OrderService;
  let userService: UserService;
  let productService: ProductService;
  let couponService: CouponService;
  let redlockService: RedlockService;
  let prisma: PrismaService;
  let module: TestingModule;


  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [UserModule, ProductModule, CouponModule, PrismaModule, OrderModule, WinstonModule.forRoot(winstonConfig), RedisModule.forRoot({
        config: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT)
        }
      })],
      providers: [RedlockService]
    }).compile()

    orderFacadeService = module.get<OrderFacadeService>(OrderFacadeService);
    orderService = module.get<OrderService>(OrderService);
    userService = module.get<UserService>(UserService);
    productService = module.get<ProductService>(ProductService);
    couponService = module.get<CouponService>(CouponService);
    prisma = module.get<PrismaService>(PrismaService);
    redlockService = module.get<RedlockService>(RedlockService);

    await prisma.orderProduct.deleteMany();
    await prisma.orders.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();
  });



  describe('동시성 테스트', () => {
    it('재고가 10개인 상품을 5개씩 3번 동시에 주문하면 하나는 실패해야 한다', async () => {
      // given
      const createUserReqDto = new CreateUserReqDto();
      createUserReqDto.points = 1000000;
      const user = await userService.createUser(createUserReqDto)

      await prisma.product.create({
        data: {
          id: 1,
          name: 'test',
          description: 'test',
          price: 5000,
          stock: 10
        }
      })

      // when && then
      let successCount = 0;
      let failCount = 0;

      const orderProductReqDto = new OrderProductReqDto();
      orderProductReqDto.userId = user.id;
      orderProductReqDto.products = [
        { productId: 1, amount: 5 }
      ]

      await Promise.allSettled([
        orderFacadeService.orderProduct(orderProductReqDto),
        orderFacadeService.orderProduct(orderProductReqDto),
        orderFacadeService.orderProduct(orderProductReqDto)
      ]).then((results) => {
        results.forEach((result) => {
          if (result.status === 'fulfilled') {
            successCount++;
          } else {
            failCount++;
          }
        })
      })

      console.log(successCount, failCount);
      expect(successCount).toBe(2);
      expect(failCount).toBe(1);
    }, 10000);
  });
});
