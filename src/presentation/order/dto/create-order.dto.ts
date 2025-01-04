import { ApiProperty } from "@nestjs/swagger";
import { OrderItemDto } from "./order-item.dto";

export class CreateOrderDto {
  @ApiProperty({
    description: "사용자 ID",
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: "주문 상품 목록",
    type: [OrderItemDto],
  })
  items: OrderItemDto[];

  @ApiProperty({
    description: "쿠폰 ID",
    example: 1,
    required: false,
    nullable: true,
  })
  couponId?: number | null;
}
