import { Inject, Injectable, Logger } from "@nestjs/common";
import { IOrderRepository, ORDER_REPOSITORY } from "@/order/domain/repository/order.repository";
import { OrderStatus } from "@prisma/client";
import { CreateOrderWithDetailsDto, OrderCreateDto } from "@/order/domain/dto/order-create.dto";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";

@Injectable()
export class OrderService {
    constructor(
        @Inject(ORDER_REPOSITORY)
        private readonly orderRepository: IOrderRepository,
        @Inject(WINSTON_MODULE_PROVIDER)
        private readonly logger: Logger
    ) {}

    async createOrder(order: OrderCreateDto, tx: any) {
        try {
            return await this.orderRepository.createOrder(order, tx);
        } catch (error) {
            this.logger.error(`Failed to create order: ${error}`);
            throw error;
        }
    }

    async createOrderProduct(orderProduct: { orderId: number; productId: number; quantity: number; itemTotal: number; }, tx: any) {
        try {
            return await this.orderRepository.createOrderProduct(orderProduct, tx);
        } catch (error) {
            this.logger.error(`Failed to create order product: ${error}`);
            throw error;
        }
    }

    async createOrderWithDetails(data: CreateOrderWithDetailsDto, tx: any) {
        const finalAmount = data.totalSum - data.discountAmount;
        
        try {
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
        } catch (error) {
            this.logger.error(`Failed to create order with details: ${error}`);
            throw error;
        }
    }

    async getOrderAmount(orderId: number, tx: any): Promise<number> {
        const order = await this.orderRepository.findById(orderId, tx);
        return order.orderTotal;
    }
}