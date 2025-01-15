import { Injectable } from "@nestjs/common";
import { Orders } from "@prisma/client";
import { OrderModel, OrderStatus } from "@/order/domain/model/order";

@Injectable()
export class OrderMapper {
    toDomain(order: Orders): OrderModel {
        return new OrderModel({
            id: order.id,
            userId: order.userId,
            couponId: order.couponId,
            orderSubtotal: order.orderSubtotal,
            discount: order.discount,
            orderTotal: order.orderTotal,
            orderStatus: order.orderStatus as OrderStatus,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt
        });
    }

    toDomainList(orders: Orders[]): OrderModel[] {
        return orders.map(order => this.toDomain(order));
    }
}