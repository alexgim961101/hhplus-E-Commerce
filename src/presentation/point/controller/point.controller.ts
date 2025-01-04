import {
  Body,
  Controller,
  Post,
  HttpException,
  HttpStatus,
  Get,
  Param,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ChargePointDto, PaymentMethod } from "../dto/charge-point.dto";

@ApiTags("Point")
@Controller("point")
export class PointController {
  private userBalances: Map<number, number> = new Map();
  private readonly MAX_CHARGE_AMOUNT = 1000000;
  private readonly MAX_BALANCE = 1000000000;

  @Post("charge")
  @ApiOperation({ summary: "포인트 충전 API" })
  @ApiResponse({
    status: 201,
    description: "포인트 충전 성공",
    schema: {
      example: {
        userId: 1,
        balance: 50000,
        message: "충전이 완료되었습니다.",
      },
    },
  })
  @ApiResponse({ status: 400, description: "잘못된 요청" })
  @ApiResponse({ status: 404, description: "사용자를 찾을 수 없음" })
  async chargePoint(@Body() dto: ChargePointDto) {
    // 금액 유효성 검사
    if (dto.amount <= 0 || !Number.isInteger(dto.amount)) {
      throw new HttpException(
        "올바른 형식의 금액이 아닙니다.",
        HttpStatus.BAD_REQUEST
      );
    }

    // 최대 충전 한도 검사
    if (dto.amount > this.MAX_CHARGE_AMOUNT) {
      throw new HttpException(
        "1회 최대 충전 한도를 초과하셨습니다.",
        HttpStatus.BAD_REQUEST
      );
    }

    // 결제 수단 검사
    if (!Object.values(PaymentMethod).includes(dto.paymentMethod)) {
      throw new HttpException(
        "올바르지 않은 충전수단입니다.",
        HttpStatus.BAD_REQUEST
      );
    }

    // 현재 잔액 조회 (Mock 데이터)
    const currentBalance = this.userBalances.get(dto.userId) || 0;

    // 최대 보유 잔액 검사
    if (currentBalance + dto.amount > this.MAX_BALANCE) {
      throw new HttpException(
        "보유할 수 있는 최대 잔액을 초과하셨습니다.",
        HttpStatus.BAD_REQUEST
      );
    }

    // 잔액 업데이트
    const newBalance = currentBalance + dto.amount;
    this.userBalances.set(dto.userId, newBalance);

    return {
      userId: dto.userId,
      balance: newBalance,
      message: "충전이 완료되었습니다.",
    };
  }

  @Get(":userId")
  @ApiOperation({ summary: "포인트 조회 API" })
  @ApiResponse({
    status: 200,
    description: "포인트 조회 성공",
    schema: {
      example: {
        userId: 1,
        balance: 50000,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "사용자를 찾을 수 없음",
    schema: {
      example: {
        message: "존재하지 않는 사용자입니다.",
        statusCode: 404,
      },
    },
  })
  async getBalance(@Param("userId") userId: number) {
    // 문자열로 들어온 userId를 숫자로 변환
    const userIdNum = Number(userId);

    // 사용자 존재 여부 확인 (Mock 데이터)
    const balance = this.userBalances.get(userIdNum);
    if (balance === undefined) {
      throw new HttpException(
        "존재하지 않는 사용자입니다.",
        HttpStatus.NOT_FOUND
      );
    }

    return {
      userId: userIdNum,
      balance: balance,
    };
  }
}
