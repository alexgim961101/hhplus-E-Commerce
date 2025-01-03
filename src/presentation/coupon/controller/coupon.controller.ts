import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CouponDto } from "../dto/coupon.dto";
import { IssueCouponDto } from "../dto/issue-coupon.dto";

@ApiTags("Coupon")
@Controller("coupons")
export class CouponController {
  // Mock 데이터를 저장할 Map (실제로는 DB를 사용해야 함)
  private userCoupons: Map<number, CouponDto[]> = new Map();
  private couponIssueCounts: Map<number, number> = new Map(); // 쿠폰별 발급 수량 추적
  private issuedUsers: Set<string> = new Set(); // 쿠폰별 발급받은 사용자 추적
  private readonly MAX_ISSUE_COUNT = 30; // 선착순 최대 발급 수량

  constructor() {
    // Mock 데이터 초기화
    this.userCoupons.set(1, [
      {
        id: 1,
        name: "신규 가입 할인 쿠폰",
        startDate: new Date("2024-01-01"),
        expirationDate: new Date("2024-12-31"),
        isAvailable: true,
        usedAt: null,
      },
      {
        id: 2,
        name: "생일 축하 쿠폰",
        startDate: new Date("2024-01-01"),
        expirationDate: new Date("2024-12-31"),
        isAvailable: false,
        usedAt: new Date("2024-01-15"),
      },
    ]);
  }

  @Get("user/:userId")
  @ApiOperation({ summary: "사용자의 보유 쿠폰 목록 조회" })
  @ApiResponse({
    status: 200,
    description: "쿠폰 목록 조회 성공",
    type: [CouponDto],
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
  async getUserCoupons(@Param("userId") userId: string): Promise<CouponDto[]> {
    const userIdNum = Number(userId);
    const coupons = this.userCoupons.get(userIdNum);

    if (!coupons) {
      throw new HttpException(
        "존재하지 않는 사용자입니다.",
        HttpStatus.NOT_FOUND
      );
    }

    return coupons;
  }

  @Post("issue")
  @ApiOperation({ summary: "선착순 쿠폰 발급 API" })
  @ApiResponse({
    status: 201,
    description: "쿠폰 발급 성공",
    schema: {
      example: {
        userId: 1,
        couponId: 1,
        message: "쿠폰이 발급되었습니다.",
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "잘못된 요청",
    schema: {
      example: {
        message: "이미 발급받은 쿠폰입니다.",
        statusCode: 400,
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
  async issueCoupon(@Body() dto: IssueCouponDto) {
    // 사용자 존재 여부 확인
    const userCoupons = this.userCoupons.get(dto.userId);
    if (userCoupons === undefined) {
      throw new HttpException(
        "존재하지 않는 사용자입니다.",
        HttpStatus.NOT_FOUND
      );
    }

    // 중복 발급 체크
    const issueKey = `${dto.userId}-${dto.couponId}`;
    if (this.issuedUsers.has(issueKey)) {
      throw new HttpException(
        "이미 발급받은 쿠폰입니다.",
        HttpStatus.BAD_REQUEST
      );
    }

    // 발급 수량 체크
    const currentIssueCount = this.couponIssueCounts.get(dto.couponId) || 0;
    if (currentIssueCount >= this.MAX_ISSUE_COUNT) {
      throw new HttpException(
        "선착순 쿠폰이 모두 소진되었습니다.",
        HttpStatus.BAD_REQUEST
      );
    }

    // 쿠폰 발급 처리
    this.issuedUsers.add(issueKey);
    this.couponIssueCounts.set(dto.couponId, currentIssueCount + 1);

    // 사용자의 쿠폰 목록에 추가
    const newCoupon: CouponDto = {
      id: dto.couponId,
      name: "선착순 할인 쿠폰",
      startDate: new Date(),
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30일 후 만료
      isAvailable: true,
      usedAt: null,
    };
    userCoupons.push(newCoupon);

    return {
      userId: dto.userId,
      couponId: dto.couponId,
      message: "쿠폰이 발급되었습니다.",
    };
  }
}
