type CouponHistoryModelProps = {
    id?: number;
    userId?: number;
    couponId?: number;
    isUsed?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export class CouponHistoryModel {
    id?: number;
    userId?: number;
    couponId?: number;
    isUsed?: boolean;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(props: CouponHistoryModelProps) {
        this.id = props.id;
        this.userId = props.userId;
        this.couponId = props.couponId;
        this.isUsed = props.isUsed;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }

    useCoupon() {
        this.isUsed = true;
    }
}