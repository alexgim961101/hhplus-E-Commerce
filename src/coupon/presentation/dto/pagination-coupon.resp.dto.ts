import { Coupon } from "@prisma/client";

export class PaginationCouponRespDto {
    coupons: Coupon[];
    totalPage: number;
    currentPage: number;
    totalCount: number;
}