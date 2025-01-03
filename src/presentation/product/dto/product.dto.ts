import { ApiProperty } from "@nestjs/swagger";

export class ProductDto {
  @ApiProperty({
    description: "상품 ID",
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: "상품명",
    example: "맥북 프로 16인치",
  })
  name: string;

  @ApiProperty({
    description: "상품 가격",
    example: 3600000,
  })
  price: number;

  @ApiProperty({
    description: "재고 수량",
    example: 100,
  })
  stock: number;
}
