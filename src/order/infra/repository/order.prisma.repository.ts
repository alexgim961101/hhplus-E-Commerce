import { Injectable } from "@nestjs/common";
import { IOrderRepository } from "@/order/domain/repository/order.repository";
import { PrismaService } from "@/prisma/prisma.service";
import { Orders, OrderProduct } from "@prisma/client";

@Injectable()
export class OrderPrismaRepository implements IOrderRepository {
    constructor(private readonly prisma: PrismaService) {}

    async createOrder(order: { userId: number; orderSubtotal: number; discount: number; orderTotal: number; couponId: number; orderStatus: "PENDING"; }, tx?: any): Promise<Orders> {
        const prisma = tx || this.prisma;
        return await prisma.order.create({
            data: order
        });
    }

    async createOrderProduct(orderProduct: { orderId: number; productId: any; amount: any; }, tx: any): Promise<OrderProduct> {
        const prisma = tx || this.prisma;
        return await prisma.orderProduct.create({
            data: orderProduct
        });
    }
}