export class OrderProductModel {
    id?: number;
    orderId?: number;
    productId?: number;
    quantity?: number;
    itemTotal?: number;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(orderProduct: Partial<OrderProductModel>) {
        this.id = orderProduct.id;
        this.orderId = orderProduct.orderId;
        this.productId = orderProduct.productId;
        this.quantity = orderProduct.quantity;
        this.itemTotal = orderProduct.itemTotal;
        this.createdAt = orderProduct.createdAt;
        this.updatedAt = orderProduct.updatedAt;
    }
}