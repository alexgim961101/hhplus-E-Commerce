import { Inject, Injectable } from "@nestjs/common";
import { IOrderRepository, ORDER_REPOSITORY } from "@/order/domain/repository/order.repository";
import { OrderStatus } from "@prisma/client";
import { CreateOrderWithDetailsDto, OrderCreateDto } from "@/order/domain/dto/order-create.dto";

@Injectable()
export class OrderService {
    constructor(
        @Inject(ORDER_REPOSITORY)
        private readonly orderRepository: IOrderRepository
    ) {}

    async createOrder(order: OrderCreateDto, tx: any) {
        console.log(order);
        return await this.orderRepository.createOrder(order, tx);
    }

    async createOrderProduct(orderProduct: { orderId: number; productId: number; quantity: number; itemTotal: number; }, tx: any) {
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
                    quantity: product.amount,
                    itemTotal: product.price * product.amount
                }, tx)
            )
        );

        return {
            order,
            finalAmount
        };
    }
}