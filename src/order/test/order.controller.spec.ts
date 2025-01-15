import { OrderController } from "@/order/presentation/controller/order.controller";
import { OrderFacadeService } from "@/order/application/facade/order.facade.service";
import { Test } from "@nestjs/testing";
import { TestingModule } from "@nestjs/testing";
import { OrderProductReqDto } from "@/order/presentation/dto/request/order-product.dto";
import { BadRequestException } from "@nestjs/common";

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
                        orderProduct: jest.fn(),
                    }
                }
            ]
        }).compile();

        controller = module.get<OrderController>(OrderController);
        facadeService = module.get<OrderFacadeService>(OrderFacadeService);
    })

    describe('orderProduct', () => {
        it('상품이 없는 경우 BadRequestException이 발생해야 한다', async () => {
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
        })

        it('쿠폰이 존재하지 않는 경우 BadRequestException이 발생해야 한다', async () => {
            // given
            const orderReq: OrderProductReqDto = {
                userId: 1,
                couponId: 312312,
                products: [
                    {
                        productId: 1,
                        amount: 1
                    }
                ]
            };

            // when
            jest.spyOn(facadeService, 'orderProduct').mockRejectedValue(
                new BadRequestException('쿠폰이 존재하지 않습니다.')
            );

            // then
            await expect(controller.orderProduct(orderReq)).rejects.toThrow(BadRequestException);
        })
    })
})