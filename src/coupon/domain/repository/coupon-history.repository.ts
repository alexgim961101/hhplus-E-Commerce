import { CouponHistoryModel } from "@/coupon/domain/model/coupon-history";
import { CouponModel } from "@/coupon/domain/model/coupon";

export interface CouponHistoryRepository {
    useCoupon(id: number, tx?: any): Promise<CouponHistoryModel>;
    findCouponHistoryByCouponIdAndUserId(couponId: number, userId: number, tx?: any): Promise<CouponHistoryModel>;
    saveCouponHistory(couponId: number, userId: number, tx?: any): Promise<CouponHistoryModel>;
    findAvailableCouponByUserId(userId: number, page: number, limit: number, tx?: any): Promise<CouponModel[]>;
}

export const CouponHistoryRepository = Symbol('CouponHistoryRepository');
