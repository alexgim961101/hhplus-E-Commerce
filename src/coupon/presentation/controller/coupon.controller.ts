import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common"; 
import { PaginationCouponRespDto } from "../dto/pagination-coupon.resp.dto";
import { PaginationQueryDto } from "../../../common/dto/pagination-query.dto";
import { CouponService } from "../../domain/service/coupon.service";

@Controller('coupon')
export class CouponController {

    constructor(private readonly couponService: CouponService) {}

    @Get('user/:userId')
    async getCouponList(@Query() query: PaginationQueryDto, @Param('userId', ParseIntPipe) userId: number): Promise<PaginationCouponRespDto> {
        return await this.couponService.getCouponList(userId, query.page, query.limit);
    }
}