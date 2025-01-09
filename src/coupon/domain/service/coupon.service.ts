import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { CouponRepository } from "../repository/coupon.repository";
import { CouponHistoryRepository } from "../repository/coupon-history.repository";
import { PaginationCouponRespDto } from "src/coupon/presentation/dto/pagination-coupon.resp.dto";
import { Coupon, CouponHistory } from "@prisma/client";

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

    async getCoupon(couponId: number, tx?: any): Promise<Coupon> {
        const coupon = await this.couponRepository.findCouponByIdWithLock(couponId, tx);
        if (!coupon) {
            throw new NotFoundException("Coupon not found");
        }
        return coupon;
    }

    async issueCoupon(couponId: number, tx?: any): Promise<Coupon> {
        return await this.couponRepository.issueCoupon(couponId, tx);
    }

    async saveCouponHistory(couponId: number, userId: number, tx?: any): Promise<CouponHistory> {
        return await this.couponHistoryRepository.saveCouponHistory(couponId, userId, tx);
    }
}