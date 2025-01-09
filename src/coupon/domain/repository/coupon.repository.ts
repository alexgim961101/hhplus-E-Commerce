import { Coupon } from "@prisma/client";

export interface CouponRepository {
    findCouponByIdWithLock(couponId: number, tx?: any): Promise<Coupon>;
    issueCoupon(couponId: number, tx?: any): Promise<Coupon>;
}

export const CouponRepository = Symbol('CouponRepository');