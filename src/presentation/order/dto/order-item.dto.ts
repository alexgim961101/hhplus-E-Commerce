import { ApiProperty } from "@nestjs/swagger";

export class OrderItemDto {
  @ApiProperty({
    description: "상품 ID",
    example: 1,
  })
  productId: number;

  @ApiProperty({
    description: "주문 수량",
    example: 2,
  })
  quantity: number;
}
