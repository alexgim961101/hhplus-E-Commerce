import { CouponModel } from "@/coupon/domain/model/coupon";
import { ApiProperty } from "@nestjs/swagger";
import { Coupon, CouponHistory } from "@prisma/client";

export class IssueCouponRespDto {
    @ApiProperty({
        type: CouponModel,
        description: '발급된 쿠폰 정보',
        nullable: true
    })
    issuedCoupon: CouponModel | null;

    constructor(issuedCoupon: CouponModel | null) {
        this.issuedCoupon = issuedCoupon;
    }
}