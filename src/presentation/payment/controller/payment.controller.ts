import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { PaymentDto, PaymentMethod } from "../dto/payment.dto";

@ApiTags("Payment")
@Controller("payments")
export class PaymentController {
  private userBalances: Map<number, number> = new Map();
  private processedPayments: Set<string> = new Set(); // 중복 결제 방지
  private readonly MAX_PAYMENT_AMOUNT = 1000000000;

  constructor() {
    // Mock 데이터 초기화
    this.userBalances.set(1, 5000000);
  }

  @Post()
  @ApiOperation({ summary: "상품 결제 API" })
  @ApiResponse({
    status: 201,
    description: "결제 성공",
    schema: {
      example: {
        userId: 1,
        orderId: 1,
        amount: 3600000,
        remainingBalance: 1400000,
        message: "결제가 완료되었습니다.",
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "잘못된 요청",
    schema: {
      example: {
        message: "올바르지 않은 결제수단입니다.",
        statusCode: 400,
      },
    },
  })
  async processPayment(@Body() dto: PaymentDto) {
    // 결제 수단 검증
    if (!Object.values(PaymentMethod).includes(dto.paymentMethod)) {
      throw new HttpException(
        "올바르지 않은 결제수단입니다.",
        HttpStatus.BAD_REQUEST
      );
    }

    // 결제 한도 검증
    if (dto.amount > this.MAX_PAYMENT_AMOUNT) {
      throw new HttpException(
        "1회 결제 금액 한도를 초과하였습니다.",
        HttpStatus.BAD_REQUEST
      );
    }

    // 중복 결제 검증
    const paymentKey = `${dto.userId}-${dto.orderId}`;
    if (this.processedPayments.has(paymentKey)) {
      throw new HttpException(
        "이미 처리된 결제입니다.",
        HttpStatus.BAD_REQUEST
      );
    }

    // 잔액 검증
    const currentBalance = this.userBalances.get(dto.userId);
    if (currentBalance === undefined) {
      throw new HttpException(
        "존재하지 않는 사용자입니다.",
        HttpStatus.NOT_FOUND
      );
    }

    if (currentBalance < dto.amount) {
      throw new HttpException("잔액이 부족합니다.", HttpStatus.BAD_REQUEST);
    }

    // 결제 처리
    const newBalance = currentBalance - dto.amount;
    this.userBalances.set(dto.userId, newBalance);
    this.processedPayments.add(paymentKey);

    // 외부 데이터 플랫폼에 결제 정보 전송 (Mock)
    this.sendToDataPlatform({
      userId: dto.userId,
      orderId: dto.orderId,
      amount: dto.amount,
      paymentMethod: dto.paymentMethod,
      timestamp: new Date(),
    });

    return {
      userId: dto.userId,
      orderId: dto.orderId,
      amount: dto.amount,
      remainingBalance: newBalance,
      message: "결제가 완료되었습니다.",
    };
  }

  private sendToDataPlatform(data: any) {
    // 실제로는 외부 데이터 플랫폼 API를 호출
    console.log("Sending to data platform:", data);
  }
}
