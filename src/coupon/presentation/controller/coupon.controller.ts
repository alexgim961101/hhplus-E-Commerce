import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { PaginationQueryDto } from "src/common/dto/pagiantion-query.dto";
import { PaginationCouponRespDto } from "../dto/pagination-coupon.resp.dto";

@Controller('coupon')
export class CouponController {

    @Get('user/:userId')
    async getCouponList(@Query() query: PaginationQueryDto, @Param('userId', ParseIntPipe) userId: number): Promise<PaginationCouponRespDto> {
        return {
            coupons: [],
            totalPage: 1,
            currentPage: 1,
            totalCount: 1
        }
    }
}