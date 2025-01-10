import { Controller, Get, Param, ParseIntPipe, Post, Query } from "@nestjs/common"; 
import { PaginationCouponRespDto } from "../dto/pagination-coupon.resp.dto";
import { PaginationQueryDto } from "../../../common/dto/pagination-query.dto";
import { CouponService } from "../../domain/service/coupon.service";
import { CouponFacadeService } from "../../application/coupon.facade.service";
import { IssueCouponRespDto } from "../dto/issue-coupon.resp.dto";
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('Coupon')
@Controller('coupon')
export class CouponController {
    constructor(
        private readonly couponFacadeService: CouponFacadeService, 
        private readonly couponService: CouponService
    ) {}

    @ApiOperation({ summary: '사용자 쿠폰 목록 조회', description: '특정 사용자의 보유 쿠폰 목록을 조회합니다.' })
    @ApiParam({ name: 'userId', description: '사용자 ID' })
    @ApiResponse({ 
        status: 200, 
        description: '쿠폰 목록 조회 성공',
        type: PaginationCouponRespDto 
    })
    @Get('user/:userId')
    async getCouponList(
        @Query() query: PaginationQueryDto, 
        @Param('userId', ParseIntPipe) userId: number
    ): Promise<PaginationCouponRespDto> {
        return await this.couponService.getCouponList(userId, query.page, query.limit);
    }

    @ApiOperation({ summary: '쿠폰 발급', description: '선착순 쿠폰을 발급받습니다.' })
    @ApiParam({ name: 'userId', description: '사용자 ID' })
    @ApiParam({ name: 'couponId', description: '쿠폰 ID' })
    @ApiResponse({ 
        status: 200, 
        description: '쿠폰 발급 성공',
        type: IssueCouponRespDto 
    })
    @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' })
    @Post('issue/:userId/:couponId')
    async issueCoupon(
        @Param('userId', ParseIntPipe) userId: number, 
        @Param('couponId', ParseIntPipe) couponId: number
    ): Promise<IssueCouponRespDto> {
        const result = await this.couponFacadeService.issueCoupon(userId, couponId);
        return IssueCouponRespDto.from(result);
    }
}