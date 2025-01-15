import { IOrderRepository, ORDER_REPOSITORY } from "@/order/domain/repository/order.repository";
import { OrderService } from "@/order/domain/service/order.service";
import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { OrderStatus } from "@/order/domain/model/order";

describe('OrderService', () => {
    let service: OrderService;
    let repository: IOrderRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OrderService,
                {
                    provide: ORDER_REPOSITORY,
                    useValue: {
                        createOrder: jest.fn(),
                        createOrderProduct: jest.fn()
                    }
                }
            ]
        }).compile();

        service = module.get<OrderService>(OrderService);
        repository = module.get<IOrderRepository>(ORDER_REPOSITORY);
    });

    describe('createOrder', () => {
        it('할인 금액이 주문 총액보다 큰 경우 예외가 발생해야 한다', async () => {
            // Given
            const invalidOrder = {
                userId: 1,
                orderSubtotal: 10000,
                discount: 20000,
                orderTotal: -10000,
                couponId: 1,
                orderStatus: OrderStatus.PENDING
            };

            // When & Then
            await expect(service.createOrder(invalidOrder, null))
                .rejects
                .toThrow(BadRequestException);
        });

        it('주문 총액이 음수인 경우 예외가 발생해야 한다', async () => {
            // Given
            const invalidOrder = {
                userId: 1,
                orderSubtotal: -10000,
                discount: 0,
                orderTotal: -10000,
                couponId: 1,
                orderStatus: OrderStatus.PENDING
            };

            // When & Then
            await expect(service.createOrder(invalidOrder, null))
                .rejects
                .toThrow(BadRequestException);
        });
    })

    describe('createOrderProduct', () => {
        it('주문 수량이 0 이하인 경우 예외가 발생해야 한다', async () => {
            // Given
            const invalidOrderProduct = {
                orderId: 1,
                productId: 1,
                quantity: 0,
                itemTotal: 10000
            };

            // When & Then
            await expect(service.createOrderProduct(invalidOrderProduct, null))
                .rejects
                .toThrow(BadRequestException);
        });

        it('상품 금액이 0 이하인 경우 예외가 발생해야 한다', async () => {
            // Given
            const invalidOrderProduct = {
                orderId: 1,
                productId: 1,
                quantity: 1,
                itemTotal: 0
            };

            // When & Then
            await expect(service.createOrderProduct(invalidOrderProduct, null))
                .rejects
                .toThrow(BadRequestException);
        });
    })

    describe('createOrderWithDetails', () => {
        it('상품 목록이 비어있는 경우 예외가 발생해야 한다', async () => {
            // Given
            const invalidOrderDetails = {
                userId: 1,
                products: [],
                totalSum: 0,
                discountAmount: 0,
                couponId: 1
            };

            // When & Then
            await expect(service.createOrderWithDetails(invalidOrderDetails, null))
                .rejects
                .toThrow(BadRequestException);
        });
    })
})