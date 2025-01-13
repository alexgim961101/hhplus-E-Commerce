type CouponModelProps = {
    id?: number;
    title?: string;
    description?: string;
    discountType?: DiscountType;
    discountAmount?: number;
    validFrom?: Date;
    validTo?: Date;
    maxCount?: number;
    currentCount?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export enum DiscountType {
    PERCENTAGE = 'PERCENTAGE',
    FIXED = 'FIXED'
}

export class CouponModel {
    id?: number;
    title?: string;
    description?: string;
    discountType?: DiscountType;
    discountAmount?: number;
    validFrom?: Date;
    validTo?: Date;
    maxCount?: number;
    currentCount?: number;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(props: CouponModelProps) {
        this.id = props.id;
        this.title = props.title;
        this.description = props.description;
        this.discountType = props.discountType;
        this.discountAmount = props.discountAmount;
        this.validFrom = props.validFrom;
        this.validTo = props.validTo;
        this.maxCount = props.maxCount;
        this.currentCount = props.currentCount;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }

    checkCouponDateValidity(date: Date) {
        if (this.validFrom && this.validTo && date < this.validFrom || date > this.validTo) {
            return false;
        }
        return true;
    }

    issueCoupon() {
        this.currentCount++;
    }

    checkCouponCountValidity() {
        if (this.maxCount && this.currentCount >= this.maxCount) {
            return false;
        }
        return true;
    }
}