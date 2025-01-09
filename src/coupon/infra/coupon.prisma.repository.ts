import { Injectable } from "@nestjs/common";
import { CouponRepository } from "../domain/repository/coupon.repository";
import { Coupon } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class CouponPrismaRepository implements CouponRepository {

    constructor(private readonly prisma: PrismaService) {}

    async findCouponByIdWithLock(couponId: number, tx?: any): Promise<Coupon> {
        const prisma = tx || this.prisma;
        const [coupon] = await prisma.$queryRaw<Coupon[]>`
            SELECT * FROM Coupon WHERE id = ${couponId} FOR UPDATE
        `;
        return coupon;
    }

    async issueCoupon(couponId: number, tx?: any): Promise<Coupon> {
        const prisma = tx || this.prisma;
        return await prisma.coupon.update({
            where: { id: couponId },
            data: { currentCount: { increment: 1 } }
        });
    }
}