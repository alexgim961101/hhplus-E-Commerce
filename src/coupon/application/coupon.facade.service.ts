import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CouponService } from "@/coupon/domain/service/coupon.service";
import { UserService } from "@/user/domain/service/user.service";
import { PrismaService } from "@/prisma/prisma.service";
import { CouponModel } from "@/coupon/domain/model/coupon";

@Injectable()
export class CouponFacadeService {
    constructor(private readonly couponService: CouponService, private readonly userService: UserService, private readonly prisma: PrismaService) {}

    async issueCoupon(userId: number, couponId: number): Promise<CouponModel> {
        // 1. user 정보 확인 - UserService에서 이미 NotFoundException을 던짐
        const user = await this.userService.getUser(userId);

        return await this.prisma.runInTransaction(async (tx) => {
            // 2. 쿠폰 정보 가져오기
            const coupon = await this.couponService.getCoupon(couponId, tx);

            // 3. 쿠폰 발급 가능한지 확인
            if (!coupon.checkCouponCountValidity()) {
                throw new BadRequestException('쿠폰 발급 가능 수량을 초과하였습니다.');
            }

            // 4. 쿠폰 발급
            const issuedCoupon = await this.couponService.issueCoupon(couponId, tx);

            // 5. 쿠폰 발급 내역 저장
            await this.couponService.saveCouponHistory(issuedCoupon.id, user.id, tx);

            return issuedCoupon;
        });
    }
}