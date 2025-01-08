import { Inject, Injectable } from "@nestjs/common";
import { CouponRepository } from "../repository/coupon.repository";
import { CouponHistoryRepository } from "../repository/coupon-history.repository";
import { PaginationCouponRespDto } from "src/coupon/presentation/dto/pagination-coupon.resp.dto";

@Injectable()
export class CouponService {
    constructor(
        @Inject(CouponRepository)
        private readonly couponRepository: CouponRepository,
        @Inject(CouponHistoryRepository)
        private readonly couponHistoryRepository: CouponHistoryRepository
    ) {}

    async getCouponList(userId: number, page: number, limit: number): Promise<PaginationCouponRespDto> {
        const { coupons, total } = await this.couponHistoryRepository.findAvailableCouponByUserId(userId, page, limit);
        return {
            coupons,
            totalPage: Math.ceil(total / limit),
            currentPage: page,
            totalCount: total
        }
    }

}