import { Test, TestingModule } from '@nestjs/testing';
import { OrderFacadeService } from '../application/facade/order.facade.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OrderController } from '../presentation/controller/order.controller';
import { OrderProductReqDto } from '../presentation/dto/order-product.req.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let facadeService: OrderFacadeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderFacadeService,
          useValue: {
            orderProduct: jest.fn()
          }
        }
      ]
    }).compile();

    controller = module.get<OrderController>(OrderController);
    facadeService = module.get<OrderFacadeService>(OrderFacadeService);
  });

  describe('orderProduct', () => {
    it('주문이 성공적으로 생성되어야 한다', async () => {
      // Given
      const orderReq: OrderProductReqDto = {
        userId: 1,
        couponId: 1,
        products: [
          { productId: 1, amount: 2 }
        ]
      };

      const mockResponse = {
        products: [{ productId: 1, amount: 2 }],
        sum: 20000,
        discount: 2000,
        total: 18000
      };

      jest.spyOn(facadeService, 'orderProduct').mockResolvedValue(mockResponse);

      // When
      const result = await controller.orderProduct(orderReq);

      // Then
      expect(facadeService.orderProduct).toHaveBeenCalledWith(orderReq);
      expect(result).toEqual(mockResponse);
    });

    it('잘못된 요청시 BadRequestException이 발생해야 한다', async () => {
      // Given
      const orderReq: OrderProductReqDto = {
        userId: 1,
        products: []
      };

      jest.spyOn(facadeService, 'orderProduct').mockRejectedValue(
        new BadRequestException('주문할 상품이 없습니다.')
      );

      // When & Then
      await expect(controller.orderProduct(orderReq)).rejects.toThrow(BadRequestException);
    });
  });
});