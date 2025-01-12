import { BadRequestException } from "@nestjs/common";

type UserModelProps = {
    id?: number;
    points?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export class UserModel {
    id?: number;
    points?: number;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(props: UserModelProps) {
        this.id = props.id;
        this.points = props.points;
        this.createdAt = props.createdAt;
        this.updatedAt = props.updatedAt;
    }

    usePoint(amount: number) {
        if (this.points < amount) {
            throw new BadRequestException('포인트가 부족합니다.');
        }
        this.points -= amount;
    }

    chargePoint(amount: number) {
        if (amount < 0) {
            throw new BadRequestException('포인트는 양수여야 합니다.');
        }
        this.points += amount;
    }
}