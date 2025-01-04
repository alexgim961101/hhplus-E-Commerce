import { ApiProperty } from "@nestjs/swagger";

export enum PaymentMethod {
  CREDIT_CARD = "CREDIT_CARD",
  BANK_TRANSFER = "BANK_TRANSFER",
}

export class PaymentDto {
  @ApiProperty({
    description: "사용자 ID",
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: "주문 ID",
    example: 1,
  })
  orderId: number;

  @ApiProperty({
    description: "결제 금액",
    example: 3600000,
  })
  amount: number;

  @ApiProperty({
    description: "결제 수단",
    enum: PaymentMethod,
    example: PaymentMethod.CREDIT_CARD,
  })
  paymentMethod: PaymentMethod;
}
