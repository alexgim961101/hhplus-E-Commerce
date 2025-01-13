import { CouponModel } from "@/coupon/domain/model/coupon";

export class PaginationCouponRespDto {
    coupons: CouponModel[];
    totalPage: number;
    currentPage: number;
    totalCount: number;

    constructor(coupons: CouponModel[], page: number, limit: number) {
        this.coupons = coupons;
        this.totalPage = Math.ceil(coupons.length / limit);
        this.currentPage = page;
        this.totalCount = coupons.length;
    }
}