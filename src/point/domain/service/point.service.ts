import { Inject, Injectable } from "@nestjs/common";
import { PointHistoryRepositoryInterface } from "@/point/domain/repository/point-history.repository";
import { POINT_HISTORY_REPOSITORY } from "@/point/domain/repository/point-history.repository";
import { PointModel, TransactionType } from "@/point/domain/model/point";

@Injectable()
export class PointService {
    constructor(@Inject(POINT_HISTORY_REPOSITORY) private readonly pointHistoryRepository: PointHistoryRepositoryInterface){}

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

        return await this.pointHistoryRepository.create(point, tx);
    }
}