import { PrismaService } from "@/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { PointMapper } from "@/point/infra/mapper/point.mapper";
import { PointModel } from "@/point/domain/model/point";
import { PointHistoryRepositoryInterface } from "@/point/domain/repository/point-history.repository";
import { TransactionType } from "@prisma/client";

@Injectable()
export class PointHistoryPrismaRepository implements PointHistoryRepositoryInterface {
    constructor(private readonly prisma: PrismaService, private readonly pointMapper: PointMapper) {}

    async create(point: PointModel, tx?: any): Promise<PointModel> {
        const prisma = tx || this.prisma;
        console.log(point);
        const pointHistory = await prisma.pointHistory.create({
            data: {
                userId: point.userId,
                points: point.points,
                transactionType: point.transactionType.toString() === 'CHARGE' ? TransactionType.CHARGE : TransactionType.USE
            }
        });
        return this.pointMapper.toDomain(pointHistory);
    }
}