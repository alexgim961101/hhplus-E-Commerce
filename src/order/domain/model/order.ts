export enum OrderStatus {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    SHIPPED = 'SHIPPED',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
    RETURNED = 'RETURNED'
}

export class OrderModel {
    id?: number;
    userId?: number;
    couponId?: number;
    orderSubtotal?: number;
    discount?: number;
    orderTotal?: number;
    orderStatus?: OrderStatus;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(order: Partial<OrderModel>) {
        this.id = order.id;
        this.userId = order.userId;
        this.couponId = order.couponId;
        this.orderSubtotal = order.orderSubtotal;
        this.discount = order.discount;
        this.orderTotal = order.orderTotal;
        this.orderStatus = order.orderStatus;
        this.createdAt = order.createdAt;
        this.updatedAt = order.updatedAt;
    }
}