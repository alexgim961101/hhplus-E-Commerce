import { Injectable } from "@nestjs/common";
import { CouponHistoryRepository } from "@/coupon/domain/repository/coupon-history.repository";
import { PrismaService } from "@/prisma/prisma.service";
import { CouponModel } from "@/coupon/domain/model/coupon";
import { CouponHistoryMapper } from "@/coupon/infra/mapper/coupone-history.mapper";
import { CouponMapper } from "@/coupon/infra/mapper/coupon.mapper";
import { CouponHistoryModel } from "@/coupon/domain/model/coupon-history";

@Injectable()
export class CouponHistoryPrismaRepository implements CouponHistoryRepository {

    constructor(private readonly prisma: PrismaService, private readonly couponHistoryMapper: CouponHistoryMapper, private readonly couponMapper: CouponMapper) {}

    async findAvailableCouponByUserId(userId: number, page: number, limit: number, tx?: any): Promise<CouponModel[]> {
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
        return this.couponMapper.toDomainList(result);
    }

    async saveCouponHistory(couponId: number, userId: number, tx?: any): Promise<CouponHistoryModel> {
        const prisma = tx || this.prisma;
        const result = await prisma.couponHistory.create({
            data: {
                userId,
                couponId,
                isUsed: false
            }
        });
        return this.couponHistoryMapper.toDomain(result);
    }

    async findCouponHistoryByCouponIdAndUserId(couponId: number, userId: number, tx: any): Promise<CouponHistoryModel> {
        const prisma = tx || this.prisma;
        const result = await prisma.couponHistory.findFirst({
            where: {
                couponId,
                userId
            }
        });
        return this.couponHistoryMapper.toDomain(result);
    }

    async useCoupon(id: number, tx: any): Promise<CouponHistoryModel> {
        const prisma = tx || this.prisma;
        const result = await prisma.couponHistory.update({
            where: {
                id
            },
            data: {
                isUsed: true
            }
        });
        return this.couponHistoryMapper.toDomain(result);
    }
}