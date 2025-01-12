import { Injectable, NotFoundException } from "@nestjs/common";
import { CouponService } from "@/coupon/domain/service/coupon.service";
import { UserService } from "@/user/domain/service/user.service";
import { Coupon, CouponHistory } from "@prisma/client";
import { PrismaService } from "@/prisma/prisma.service";

@Injectable()
export class CouponFacadeService {
    constructor(private readonly couponService: CouponService, private readonly userService: UserService, private readonly prisma: PrismaService) {}

    async issueCoupon(userId: number, couponId: number): Promise<{issuedCoupon: Coupon, couponHistory: CouponHistory}> {
        // 1. user 정보 확인 - UserService에서 이미 NotFoundException을 던짐
        await this.userService.getUser(userId);

        return await this.prisma.runInTransaction(async (tx) => {
            // 2. 쿠폰 정보 가져오기
            const coupon = await this.couponService.getCoupon(couponId, tx);

            // 3. 쿠폰 발급 가능한지 확인
            if (coupon.maxCount === coupon.currentCount) {
                return {
                    issuedCoupon: null,
                    couponHistory: null
                }
            }

            // 4. 쿠폰 발급
            const issuedCoupon = await this.couponService.issueCoupon(couponId, tx);

            // 5. 쿠폰 발급 내역 저장
            const couponHistory = await this.couponService.saveCouponHistory(couponId, userId, tx);

            return {
                issuedCoupon,
                couponHistory
            }
        });
    }
}