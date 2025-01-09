import { ApiProperty } from "@nestjs/swagger";
import { Coupon, CouponHistory } from "@prisma/client";

class CouponDto {
    @ApiProperty({ example: 1, description: '쿠폰 ID' })
    id: number;
    @ApiProperty({ example: '10% 할인 쿠폰', description: '쿠폰 제목' })
    title: string;
    @ApiProperty({ example: '상품 구매 시 10% 할인', description: '쿠폰 설명' })
    description: string;
    @ApiProperty({ example: 'PERCENTAGE', description: '할인 유형' })
    discountType: string;
    @ApiProperty({ example: 10, description: '할인 금액/비율' })
    discountAmount: number;
}

class CouponHistoryDto {
    @ApiProperty({ example: 1, description: '발급 내역 ID' })
    id: number;
    @ApiProperty({ example: 1, description: '사용자 ID' })
    userId: number;
    @ApiProperty({ example: 1, description: '쿠폰 ID' })
    couponId: number;
    @ApiProperty({ example: false, description: '사용 여부' })
    isUsed: boolean;
}

export class IssueCouponRespDto {
    @ApiProperty({
        type: CouponDto,
        description: '발급된 쿠폰 정보',
        nullable: true
    })
    issuedCoupon: CouponDto | null;

    @ApiProperty({
        type: CouponHistoryDto,
        description: '쿠폰 발급 내역',
        nullable: true
    })
    couponHistory: CouponHistoryDto | null;

    static from(data: {issuedCoupon: Coupon | null, couponHistory: CouponHistory | null}): IssueCouponRespDto {
        const dto = new IssueCouponRespDto();
        dto.issuedCoupon = data.issuedCoupon ? {
            id: data.issuedCoupon.id,
            title: data.issuedCoupon.title,
            description: data.issuedCoupon.description,
            discountType: data.issuedCoupon.discountType,
            discountAmount: data.issuedCoupon.discountAmount,
        } : null;
        dto.couponHistory = data.couponHistory ? {
            id: data.couponHistory.id,
            userId: data.couponHistory.userId,
            couponId: data.couponHistory.couponId,
            isUsed: data.couponHistory.isUsed,
        } : null;
        return dto;
    }
}