import { Injectable } from "@nestjs/common";
import { CouponRepository } from "../domain/repository/coupon.repository";

@Injectable()
export class CouponPrismaRepository implements CouponRepository {

}