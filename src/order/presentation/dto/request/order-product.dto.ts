import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNumber, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OrderProductItemDto {
  @ApiProperty({
    description: '상품 ID',
    example: 1
  })
  @IsNumber()
  productId: number;

  @ApiProperty({
    description: '주문 수량',
    example: 2
  })  
  @IsNumber()
  amount: number;
}

export class OrderProductReqDto {
  @ApiProperty({
    description: '사용자 ID',
    example: 1
  })
  @IsNumber()
  userId: number;

  @ApiProperty({
    description: '쿠폰 ID',
    required: false,
    example: 1
  })
  @IsNumber()
  couponId?: number;

  @ApiProperty({
    description: '주문할 상품 목록',
    type: [OrderProductItemDto],
    example: [
      {
        productId: 1,
        amount: 2
      }
    ]
  })
  @IsArray()
  @ArrayNotEmpty({ message: '주문할 상품이 없습니다.' })
  @ValidateNested({ each: true })
  @Type(() => OrderProductItemDto)
  products: OrderProductItemDto[];
}