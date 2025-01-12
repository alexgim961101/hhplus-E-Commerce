import { Inject, Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { CouponRepository } from "@/coupon/domain/repository/coupon.repository";
import { CouponHistoryRepository } from "@/coupon/domain/repository/coupon-history.repository";
import { PaginationCouponRespDto } from "@/coupon/presentation/dto/pagination-coupon.resp.dto";
import { Coupon, CouponHistory, DiscountType } from "@prisma/client";
import { ProcessCouponDiscountDto } from "@/coupon/domain/dto/process-coupon-discount.dto";

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

    async getCouponWithLock(couponId: number, tx: any): Promise<Coupon> {
        return await this.couponRepository.findCouponByIdWithLock(couponId, tx);
    }

    async getCouponHistory(couponId: number, userId: number, tx: any): Promise<CouponHistory> {
        return await this.couponHistoryRepository.findCouponHistoryByCouponIdAndUserId(couponId, userId, tx);
    }

    async useCoupon(id: number, tx: any) {
        return await this.couponHistoryRepository.useCoupon(id, tx);
    }

    async validateCoupon(coupon: Coupon, couponHistory: CouponHistory) {
        if (!coupon) {
            throw new BadRequestException('쿠폰이 존재하지 않습니다.');
        }

        if (!couponHistory) {
            throw new BadRequestException('보유하지 않은 쿠폰입니다.');
        }

        if (couponHistory.isUsed) {
            throw new BadRequestException('이미 사용된 쿠폰입니다.');
        }

        const now = new Date();
        if (now < coupon.validFrom || now > coupon.validTo) {
            throw new BadRequestException('쿠폰 사용기간이 아닙니다.');
        }
    }

    calculateDiscountAmount(coupon: Coupon, totalAmount: number): number {
        return coupon.discountType === DiscountType.PERCENTAGE
            ? Math.floor(totalAmount * (coupon.discountAmount / 100))
            : coupon.discountAmount;
    }
}