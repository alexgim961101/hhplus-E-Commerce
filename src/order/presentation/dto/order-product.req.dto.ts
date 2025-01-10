import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNumber, ValidateNested } from 'class-validator';

export class OrderProductItemDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  amount: number;
}

export class OrderProductReqDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  couponId?: number;

  @IsArray()
  @ArrayNotEmpty({ message: '주문할 상품이 없습니다.' })
  @ValidateNested({ each: true })
  @Type(() => OrderProductItemDto)
  products: OrderProductItemDto[];
}