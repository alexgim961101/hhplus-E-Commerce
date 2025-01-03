import { ApiProperty } from "@nestjs/swagger";

export enum PaymentMethod {
  CREDIT_CARD = "CREDIT_CARD",
  BANK_TRANSFER = "BANK_TRANSFER",
}

export class ChargePointDto {
  @ApiProperty({
    description: "사용자 ID",
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: "충전 금액",
    example: 50000,
    minimum: 1,
    maximum: 1000000,
  })
  amount: number;

  @ApiProperty({
    description: "결제 수단",
    enum: PaymentMethod,
    example: PaymentMethod.CREDIT_CARD,
  })
  paymentMethod: PaymentMethod;
}
