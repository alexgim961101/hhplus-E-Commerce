import { Inject, Injectable, NotFoundException, BadRequestException, Logger } from "@nestjs/common";
import { CouponRepository } from "@/coupon/domain/repository/coupon.repository";
import { CouponHistoryRepository } from "@/coupon/domain/repository/coupon-history.repository";
import { CouponModel, DiscountType } from "@/coupon/domain/model/coupon";
import { CouponHistoryModel } from "@/coupon/domain/model/coupon-history";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
@Injectable()
export class CouponService {
    constructor(
        @Inject(CouponRepository)
        private readonly couponRepository: CouponRepository,
        @Inject(CouponHistoryRepository)
        private readonly couponHistoryRepository: CouponHistoryRepository,
        @Inject(WINSTON_MODULE_PROVIDER)
        private readonly logger: Logger,
        @Inject(CACHE_MANAGER) 
        private cacheManager: Cache
    ) {}

    async getCouponList(userId: number, page: number, limit: number): Promise<CouponModel[]> {
        const cacheKey = `coupon_list_${userId}_${page}_${limit}`;
        const cachedCouponList = await this.cacheManager.get(cacheKey);
        if (cachedCouponList) {
            return cachedCouponList as CouponModel[];
        }

        const couponList = await this.couponHistoryRepository.findAvailableCouponByUserId(userId, page, limit);
        await this.cacheManager.set(cacheKey, couponList);
        return couponList;
    }

    async getCoupon(couponId: number, tx?: any): Promise<CouponModel> {
        const coupon = await this.couponRepository.findCouponByIdWithLock(couponId, tx);
        if (!coupon) {
            this.logger.warn(`Coupon not found with id: ${couponId}`);
            throw new NotFoundException("Coupon not found");
        }
        return coupon;
    }

    async issueCoupon(couponId: number, tx?: any): Promise<CouponModel> {
        try {
            return await this.couponRepository.issueCoupon(couponId, tx);
        } catch (error) {
            this.logger.error(`Failed to issue coupon: ${error}`);
            throw error;
        }
    }

    async saveCouponHistory(couponId: number, userId: number, tx?: any): Promise<CouponHistoryModel> {
        try {
            return await this.couponHistoryRepository.saveCouponHistory(couponId, userId, tx);
        } catch (error) {
            this.logger.error(`Failed to save coupon history: ${error}`);
            throw error;
        }
    }

    async getCouponWithLock(couponId: number, tx: any): Promise<CouponModel> {
        try {
            return await this.couponRepository.findCouponByIdWithLock(couponId, tx);
        } catch (error) {
            this.logger.error(`Failed to get coupon with lock: ${error}`);
            throw error;
        }
    }

    async getCouponHistory(couponId: number, userId: number, tx: any): Promise<CouponHistoryModel> {
        try {
            return await this.couponHistoryRepository.findCouponHistoryByCouponIdAndUserId(couponId, userId, tx);
        } catch (error) {
            this.logger.error(`Failed to get coupon history: ${error}`);
            throw error;
        }
    }

    async useCoupon(id: number, tx: any) {
        try {
            return await this.couponHistoryRepository.useCoupon(id, tx);
        } catch (error) {
            this.logger.error(`Failed to use coupon: ${error}`);
            throw error;
        }
    }

    calculateDiscountAmount(coupon: CouponModel, totalAmount: number): number {
        return coupon.discountType === DiscountType.PERCENTAGE
            ? Math.floor(totalAmount * (coupon.discountAmount / 100))
            : coupon.discountAmount;
    }
}