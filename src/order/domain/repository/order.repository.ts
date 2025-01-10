import { Order, OrderProduct } from "@prisma/client";
import { OrderCreateDto } from "../dto/order-create.dto";

export interface IOrderRepository {
    createOrderProduct(orderProduct: { orderId: number; productId: number; amount: number; }, tx: any): Promise<OrderProduct>;
    createOrder(order: OrderCreateDto, tx: any): Promise<Order>;
}

export const ORDER_REPOSITORY = Symbol('ORDER_REPOSITORY');