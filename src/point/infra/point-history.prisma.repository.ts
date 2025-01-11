import { PrismaService } from "@/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { PointHistoryRepositoryInterface } from "@/point/domain/point-history.repository";
import { PointHistory } from "@prisma/client";
import { CreatePointHistoryDto } from "@/point/domain/dto/create-point-history.dto";

@Injectable()
export class PointHistoryPrismaRepository implements PointHistoryRepositoryInterface {
    constructor(private readonly prisma: PrismaService) {}

    async create(createPointHistoryDto: CreatePointHistoryDto, tx?: any): Promise<PointHistory> {
        const prisma = tx || this.prisma;
        return await prisma.pointHistory.create({
            data: {
                userId: createPointHistoryDto.userId,
                points: createPointHistoryDto.points,
                transactionType: createPointHistoryDto.transactionType
            }
        });
    }
}