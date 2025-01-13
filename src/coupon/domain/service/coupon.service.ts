import { Inject, Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { CouponRepository } from "@/coupon/domain/repository/coupon.repository";
import { CouponHistoryRepository } from "@/coupon/domain/repository/coupon-history.repository";
import { CouponModel, DiscountType } from "@/coupon/domain/model/coupon";
import { CouponHistoryModel } from "@/coupon/domain/model/coupon-history";

@Injectable()
export class CouponService {
    constructor(
        @Inject(CouponRepository)
        private readonly couponRepository: CouponRepository,
        @Inject(CouponHistoryRepository)
        private readonly couponHistoryRepository: CouponHistoryRepository
    ) {}

    async getCouponList(userId: number, page: number, limit: number): Promise<CouponModel[]> {
        return await this.couponHistoryRepository.findAvailableCouponByUserId(userId, page, limit);
    }

    async getCoupon(couponId: number, tx?: any): Promise<CouponModel> {
        const coupon = await this.couponRepository.findCouponByIdWithLock(couponId, tx);
        if (!coupon) {
            throw new NotFoundException("Coupon not found");
        }
        return coupon;
    }

    async issueCoupon(couponId: number, tx?: any): Promise<CouponModel> {
        return await this.couponRepository.issueCoupon(couponId, tx);
    }

    async saveCouponHistory(couponId: number, userId: number, tx?: any): Promise<CouponHistoryModel> {
        return await this.couponHistoryRepository.saveCouponHistory(couponId, userId, tx);
    }

    async getCouponWithLock(couponId: number, tx: any): Promise<CouponModel> {
        return await this.couponRepository.findCouponByIdWithLock(couponId, tx);
    }

    async getCouponHistory(couponId: number, userId: number, tx: any): Promise<CouponHistoryModel> {
        return await this.couponHistoryRepository.findCouponHistoryByCouponIdAndUserId(couponId, userId, tx);
    }

    async useCoupon(id: number, tx: any) {
        return await this.couponHistoryRepository.useCoupon(id, tx);
    }

    calculateDiscountAmount(coupon: CouponModel, totalAmount: number): number {
        return coupon.discountType === DiscountType.PERCENTAGE
            ? Math.floor(totalAmount * (coupon.discountAmount / 100))
            : coupon.discountAmount;
    }
}