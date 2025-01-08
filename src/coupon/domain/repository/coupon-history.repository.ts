import { Coupon, CouponHistory } from "@prisma/client";

export interface CouponHistoryRepository {
    findAvailableCouponByUserId(userId: number, page: number, limit: number, tx?: any): Promise<{coupons: Coupon[], total: number}>;
}

export const CouponHistoryRepository = Symbol('CouponHistoryRepository');
