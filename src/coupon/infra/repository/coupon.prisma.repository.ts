import { Injectable } from "@nestjs/common";
import { CouponRepository } from "@/coupon/domain/repository/coupon.repository";
import { PrismaService } from "@/prisma/prisma.service";
import { CouponModel } from "@/coupon/domain/model/coupon";
import { CouponMapper } from "@/coupon/infra/mapper/coupon.mapper";

@Injectable()
export class CouponPrismaRepository implements CouponRepository {

    constructor(private readonly prisma: PrismaService, private readonly couponMapper: CouponMapper) {}

    async findCouponByIdWithLock(couponId: number, tx?: any): Promise<CouponModel> {
        const prisma = tx || this.prisma;
        const [coupon] = await prisma.$queryRaw<CouponModel[]>`
            SELECT * FROM Coupon WHERE id = ${couponId} FOR UPDATE
        `;
        return coupon;
    }

    async issueCoupon(couponId: number, tx?: any): Promise<CouponModel> {
        const prisma = tx || this.prisma;
        const result = await prisma.coupon.update({
            where: { id: couponId },
            data: { currentCount: { increment: 1 } }
        });
        return this.couponMapper.toDomain(result);
    }
}