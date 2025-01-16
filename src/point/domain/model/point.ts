import { BadRequestException } from "@nestjs/common";

type PointModelProps = {
    id?: number;
    userId?: number;
    points?: number;
    transactionType?: TransactionType;
    createdAt?: Date;
    updatedAt?: Date;
}

export enum TransactionType {
    USE,
    CHARGE
}

export class PointModel {
    id?: number;
    userId?: number;
    points?: number = 0;
    transactionType?: TransactionType;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(props: PointModelProps) {
        this.id = props.id;
        this.userId = props.userId;
        this.points = props.points;
        this.transactionType = props.transactionType;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }

    savePoint(amount: number) {
        this.transactionType = TransactionType.CHARGE;
        this.points += amount;
    }

    usePoint(amount: number) {
        this.transactionType = TransactionType.USE;
        this.points += amount;
    }
}