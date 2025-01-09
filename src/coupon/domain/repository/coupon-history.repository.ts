import { Coupon, CouponHistory } from "@prisma/client";

export interface CouponHistoryRepository {
    saveCouponHistory(couponId: number, userId: number, tx: any): { id: number; createdAt: Date; updatedAt: Date; userId: number; couponId: number; isUsed: boolean; } | PromiseLike<{ id: number; createdAt: Date; updatedAt: Date; userId: number; couponId: number; isUsed: boolean; }>;
    findAvailableCouponByUserId(userId: number, page: number, limit: number, tx?: any): Promise<{coupons: Coupon[], total: number}>;
}

export const CouponHistoryRepository = Symbol('CouponHistoryRepository');
