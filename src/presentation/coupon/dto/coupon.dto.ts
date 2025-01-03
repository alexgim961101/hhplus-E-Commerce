import { ApiProperty } from "@nestjs/swagger";

export class CouponDto {
  @ApiProperty({
    description: "쿠폰 ID",
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: "쿠폰명",
    example: "신규 가입 할인 쿠폰",
  })
  name: string;

  @ApiProperty({
    description: "쿠폰 시작일",
    example: "2024-01-01T00:00:00Z",
  })
  startDate: Date;

  @ApiProperty({
    description: "쿠폰 만료일",
    example: "2024-12-31T23:59:59Z",
  })
  expirationDate: Date;

  @ApiProperty({
    description: "사용 가능 여부",
    example: true,
  })
  isAvailable: boolean;

  @ApiProperty({
    description: "사용 시점",
    example: "2024-01-15T14:30:00Z",
    nullable: true,
  })
  usedAt: Date | null;
}
