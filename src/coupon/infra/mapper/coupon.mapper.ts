import { CouponModel, DiscountType } from "@/coupon/domain/model/coupon";
import { Injectable } from "@nestjs/common";
import { Coupon } from "@prisma/client";

@Injectable()
export class CouponMapper {
    toDomain(coupon: Coupon): CouponModel {
        return new CouponModel({
            id: coupon.id,
            title: coupon.title,
            description: coupon.description,
            discountType: coupon.discountType as DiscountType,
            discountAmount: coupon.discountAmount,
            validFrom: coupon.validFrom,
            validTo: coupon.validTo,
            maxCount: coupon.maxCount,
            currentCount: coupon.currentCount
        });
    }

    toDomainList(coupon: Coupon[]): CouponModel[] {
        return coupon.map(this.toDomain);
    }
}