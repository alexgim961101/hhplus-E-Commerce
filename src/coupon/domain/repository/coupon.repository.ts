import { CouponModel } from "@/coupon/domain/model/coupon";

export interface CouponRepository {
    findCouponByIdWithLock(couponId: number, tx?: any): Promise<CouponModel>;
    issueCoupon(couponId: number, tx?: any): Promise<CouponModel>;
}

export const CouponRepository = Symbol('CouponRepository');