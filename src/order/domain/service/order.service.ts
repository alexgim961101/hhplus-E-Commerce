import { Inject, Injectable } from "@nestjs/common";
import { IOrderRepository, ORDER_REPOSITORY } from "../repository/order.repository";
import { Order, OrderStatus } from "@prisma/client";
import { CreateOrderWithDetailsDto, OrderCreateDto } from "../dto/order-create.dto";

@Injectable()
export class OrderService {
    constructor(
        @Inject(ORDER_REPOSITORY)
        private readonly orderRepository: IOrderRepository
    ) {}

    async createOrder(order: OrderCreateDto, tx: any) {
        return await this.orderRepository.createOrder(order, tx);
    }

    async createOrderProduct(orderProduct: { orderId: number; productId: any; amount: any; }, tx: any) {
        return await this.orderRepository.createOrderProduct(orderProduct, tx);
    }

    async createOrderWithDetails(data: CreateOrderWithDetailsDto, tx: any) {
        const finalAmount = data.totalSum - data.discountAmount;
        
        const order = await this.createOrder({
            userId: data.userId,
            orderSubtotal: data.totalSum,
            discount: data.discountAmount,
            orderTotal: finalAmount,
            couponId: data.couponId,
            orderStatus: OrderStatus.PENDING
        }, tx);

        await Promise.all(
            data.products.map(product =>
                this.createOrderProduct({
                    orderId: order.id,
                    productId: product.productId,
                    amount: product.amount,
                }, tx)
            )
        );

        return {
            order,
            finalAmount
        };
    }
}