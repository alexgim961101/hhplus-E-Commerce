import { Inject, Injectable, Logger } from "@nestjs/common";
import { PointHistoryRepositoryInterface } from "@/point/domain/repository/point-history.repository";
import { POINT_HISTORY_REPOSITORY } from "@/point/domain/repository/point-history.repository";
import { PointModel, TransactionType } from "@/point/domain/model/point";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";

@Injectable()
export class PointService {
    constructor(
        @Inject(POINT_HISTORY_REPOSITORY) private readonly pointHistoryRepository: PointHistoryRepositoryInterface,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ){}

    async savePointHistory(userId: number, points: number, type: 'charge' | 'use', tx?: any) {
        const point = new PointModel({
            userId,
            points: 0,
            transactionType: type === 'charge' ? TransactionType.CHARGE : TransactionType.USE
        });

        if(type === 'charge') {
            point.savePoint(points);
        }

        if (type === 'use') {
            point.usePoint(points);
        }

        try {
            return await this.pointHistoryRepository.create(point, tx);
        } catch (error) {
            this.logger.error(`Failed to save point history: ${error}`);
            throw error;
        }
    }
}