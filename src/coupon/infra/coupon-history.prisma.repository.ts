import { Injectable } from "@nestjs/common";
import { CouponHistoryRepository } from "../domain/repository/coupon-history.repository";
import { PrismaService } from "../../prisma/prisma.service";
import { Coupon, CouponHistory } from "@prisma/client";

@Injectable()
export class CouponHistoryPrismaRepository implements CouponHistoryRepository {

    constructor(private readonly prisma: PrismaService) {}

    async findAvailableCouponByUserId(userId: number, page: number, limit: number, tx?: any): Promise<{coupons: Coupon[], total: number}> {
        const prisma = tx || this.prisma;
        const result = await prisma.$queryRaw`
            SELECT c.*, ch.userId, ch.isUsed FROM coupon c
            JOIN coupon_history ch ON c.id = ch.couponId
            WHERE ch.userId = ${userId}
                AND ch.isUsed = false
                AND c.valid_to > NOW()
            ORDER BY c.valid_to ASC
            LIMIT ${limit}
            OFFSET ${(page - 1) * limit}
        `

        const total = await prisma.$queryRaw`
            SELECT COUNT(*) FROM coupon c
            JOIN coupon_history ch ON c.id = ch.couponId
            WHERE ch.userId = ${userId}
                AND ch.isUsed = false
                AND c.valid_to > NOW()
        `

        return {
            coupons: result,
            total: Number(total[0].count)
        }
    }

    async saveCouponHistory(couponId: number, userId: number, tx?: any): Promise<CouponHistory> {
        const prisma = tx || this.prisma;
        return await prisma.couponHistory.create({
            data: {
                userId,
                couponId,
                isUsed: false
            }
        });
    }

    async findCouponHistoryByCouponIdAndUserId(couponId: number, userId: number, tx: any): Promise<CouponHistory> {
        const prisma = tx || this.prisma;
        return await prisma.couponHistory.findFirst({
            where: {
                couponId,
                userId
            }
        });
    }

    async useCoupon(id: number, tx: any): Promise<CouponHistory> {
        const prisma = tx || this.prisma;
        return await prisma.couponHistory.update({
            where: {
                id
            },
            data: {
                isUsed: true
            }
        });
    }
}