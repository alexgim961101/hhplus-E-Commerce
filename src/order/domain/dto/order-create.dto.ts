import { OrderStatus } from "@prisma/client";

export class OrderCreateDto {
  userId: number;
  orderSubtotal: number;
  discount: number;
  orderTotal: number;
  couponId?: number;
  orderStatus: OrderStatus;
}

export class CreateOrderProductDto {
  productId: number;
  amount: number;
  price: number;
}

export class CreateOrderWithDetailsDto {
  userId: number;
  products: CreateOrderProductDto[];
  totalSum: number;
  discountAmount: number;
  couponId?: number;
}