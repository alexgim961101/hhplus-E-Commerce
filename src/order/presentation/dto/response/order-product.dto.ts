import { ApiProperty } from "@nestjs/swagger";

export class OrderProductItemRespDto {
  @ApiProperty({
    description: '상품 ID',
    example: 1
  })
  productId: number;

  @ApiProperty({
    description: '주문 수량',
    example: 2
  })
  amount: number;

  @ApiProperty({
    description: '단일 상품 금액',
    example: 10000
  })
  price: number;

  @ApiProperty({
    description: '상품 총 금액',
    example: 20000
  })
  totalPrice: number;
}

export class OrderProductRespDto {
  @ApiProperty({
    type: [OrderProductItemRespDto],
    description: '주문된 상품 목록'
  })
  products: OrderProductItemRespDto[];

  @ApiProperty({
    description: '주문 총 금액',
    example: 50000
  })
  sum: number;

  @ApiProperty({
    description: '할인 금액',
    example: 5000
  })
  discount: number;

  @ApiProperty({
    description: '최종 결제 금액',
    example: 45000
  })
  total: number;
}