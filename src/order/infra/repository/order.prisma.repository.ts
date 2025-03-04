import { Injectable } from "@nestjs/common";
import { IOrderRepository } from "@/order/domain/repository/order.repository";
import { PrismaService } from "@/prisma/prisma.service";
import { OrderProduct, Orders } from "@prisma/client";

@Injectable()
export class OrderPrismaRepository implements IOrderRepository {
    constructor(private readonly prisma: PrismaService) {}

    async createOrder(order: { userId: number; orderSubtotal: number; discount: number; orderTotal: number; couponId: number | null; orderStatus: "PENDING"; }, tx?: any): Promise<Orders> {
        const prisma = tx || this.prisma;
        return await prisma.orders.create({
            data: {
                userId: order.userId,
                couponId: order.couponId || null,
                orderSubtotal: order.orderSubtotal,
                discount: order.discount,
                orderTotal: order.orderTotal,
                orderStatus: order.orderStatus
            }
        }); 
    }

    async createOrderProduct(orderProduct: { orderId: number; productId: number; quantity: number; itemTotal: number; }, tx: any): Promise<OrderProduct> {
        const prisma = tx || this.prisma;
        return await prisma.orderProduct.create({
            data: orderProduct
        });
    }

    async findById(orderId: number, tx: any): Promise<Orders> {
        const prisma = tx || this.prisma;
        return await prisma.orders.findUnique({
            where: {
                id: orderId
            }
        });
    }
}