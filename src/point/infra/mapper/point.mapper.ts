import { PointModel, TransactionType } from "@/point/domain/model/point";
import { Injectable } from "@nestjs/common";
import { PointHistory } from "@prisma/client";

@Injectable()
export class PointMapper {
    toDomain(point: PointHistory): PointModel {
        return new PointModel({
            id: point.id,
            userId: point.userId,
            points: point.points,
            transactionType: point.transactionType as unknown as TransactionType,
            createdAt: point.createdAt,
            updatedAt: point.updatedAt
        });
    }

    toDomainList(points: PointHistory[]): PointModel[] {
        return points.map(point => this.toDomain(point));
    }
}