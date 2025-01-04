import { ApiProperty } from "@nestjs/swagger";

export class IssueCouponDto {
  @ApiProperty({
    description: "사용자 ID",
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: "쿠폰 ID",
    example: 1,
  })
  couponId: number;
}
