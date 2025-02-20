import { OrderProductModel } from "@/order/domain/model/order-product";
import { IOrderProductRepository } from "@/order/domain/repository/order-product.repository";
import { PrismaService } from "@/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { OrderProductMapper } from "../mapper/order-producr.mapper";

@Injectable()
export class OrderProductPrismaRepository implements IOrderProductRepository {
    constructor(private readonly prisma: PrismaService) {}

    async createOrderProduct(orderProduct: OrderProductModel): Promise<OrderProductModel> {
        return await this.prisma.orderProduct.create({
            data: {
                orderId: orderProduct.orderId,
                productId: orderProduct.productId,
                quantity: orderProduct.quantity,
                itemTotal: orderProduct.itemTotal
            }
        });
    }
}