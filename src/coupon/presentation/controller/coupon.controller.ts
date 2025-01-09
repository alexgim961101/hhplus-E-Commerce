import { Controller, Get, Param, ParseIntPipe, Post, Query } from "@nestjs/common"; 
import { PaginationCouponRespDto } from "../dto/pagination-coupon.resp.dto";
import { PaginationQueryDto } from "../../../common/dto/pagination-query.dto";
import { CouponService } from "../../domain/service/coupon.service";
import { CouponFacadeService } from "../../application/coupon.facade.service";
import { Coupon, CouponHistory } from "@prisma/client";

@Controller('coupon')
export class CouponController {

    constructor(private readonly couponFacadeService: CouponFacadeService, private readonly couponService: CouponService) {}

    @Get('user/:userId')
    async getCouponList(@Query() query: PaginationQueryDto, @Param('userId', ParseIntPipe) userId: number): Promise<PaginationCouponRespDto> {
        return await this.couponService.getCouponList(userId, query.page, query.limit);
    }

    /**
     * 선착순 쿠폰 발급
     * 1. userId를 받는다.
     * 2. user에 대한 정보를 가져온다.
     * 3. couponId를 받는다.
     * 4. coupon에 대한 정보를 가져온다. (Lock을 걸어 가져오기)
     * 5. coupon이 발급 가능한지 확인한다. (max_count != 0)
     * 6. 발급 가능하면 coupone의 max_count를 감소시킨다.
     * 7. 발급 가능하면 coupon_history에 발급 내역을 저장한다.
     * 8. 발급 불가능하면 불가능하다고 알린다.
     * 
     * test 1. 쿠폰 발급 성공
     * test 2. 30명 제한 시 40명이 동시에 요청할 경우 정확히 30명만 발급 성공
     */
    @Post('issue/:userId/:couponId')
    async issueCoupon(@Param('userId', ParseIntPipe) userId: number, @Param('couponId', ParseIntPipe) couponId: number): Promise<{issuedCoupon: Coupon, couponHistory: CouponHistory}> {
        return await this.couponFacadeService.issueCoupon(userId, couponId);
    }
}