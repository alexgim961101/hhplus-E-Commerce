import { CouponHistoryModel } from "@/coupon/domain/model/coupon-history";
import { Injectable } from "@nestjs/common";
import { CouponHistory } from "@prisma/client";

@Injectable()
export class CouponHistoryMapper {
    toDomain(couponHistory: CouponHistory): CouponHistoryModel {
        return new CouponHistoryModel({
            id: couponHistory.id,
            userId: couponHistory.userId,
            couponId: couponHistory.couponId,
            isUsed: couponHistory.isUsed,
            createdAt: couponHistory.createdAt,
            updatedAt: couponHistory.updatedAt
        });
    }

    toDomainList(couponHistory: CouponHistory[]): CouponHistoryModel[] {
        return couponHistory.map(this.toDomain);
    }
}