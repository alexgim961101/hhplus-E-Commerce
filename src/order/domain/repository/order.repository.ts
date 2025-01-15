import { Orders, OrderProduct } from "@prisma/client";
import { OrderCreateDto } from "@/order/domain/dto/order-create.dto";

export interface IOrderRepository {
    createOrderProduct(orderProduct: { orderId: number; productId: number; quantity: number; itemTotal: number; }, tx: any): Promise<OrderProduct>;
    createOrder(order: OrderCreateDto, tx: any): Promise<Orders>;
}

export const ORDER_REPOSITORY = Symbol('ORDER_REPOSITORY');