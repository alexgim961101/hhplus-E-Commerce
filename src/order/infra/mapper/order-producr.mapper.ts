import { Injectable } from "@nestjs/common";
import { OrderProductModel } from "@/order/domain/model/order-product";
import { OrderProduct } from "@prisma/client";

@Injectable()
export class OrderProductMapper {
    toDomain(orderProduct: OrderProduct): OrderProductModel {
        return {
            id: orderProduct.id,
            orderId: orderProduct.orderId,
            productId: orderProduct.productId,
            quantity: orderProduct.quantity,
            itemTotal: orderProduct.itemTotal,
            createdAt: orderProduct.createdAt,
            updatedAt: orderProduct.updatedAt,
        };
    }

    toDomainList(orderProducts: OrderProduct[]): OrderProductModel[] {
        return orderProducts.map(orderProduct => this.toDomain(orderProduct));
    }
}   