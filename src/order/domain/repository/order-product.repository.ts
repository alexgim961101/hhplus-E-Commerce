import { OrderProductModel } from "@/order/domain/model/order-product";

export interface IOrderProductRepository {
    createOrderProduct(orderProduct: OrderProductModel): Promise<OrderProductModel>;
}

export const ORDER_PRODUCT_REPOSITORY = Symbol('ORDER_PRODUCT_REPOSITORY');