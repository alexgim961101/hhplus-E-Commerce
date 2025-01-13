import { Inject, Injectable } from "@nestjs/common";
import { PointHistoryRepositoryInterface } from "@/point/domain/repository/point-history.repository";
import { POINT_HISTORY_REPOSITORY } from "@/point/domain/repository/point-history.repository";
import { PointModel } from "@/point/domain/model/point";

@Injectable()
export class PointService {
    constructor(@Inject(POINT_HISTORY_REPOSITORY) private readonly pointHistoryRepository: PointHistoryRepositoryInterface){}

    async savePointHistory(userId: number, points: number, type: 'charge' | 'use', tx?: any) {
        const point = new PointModel({
            userId
        });

        if(type === 'charge') {
            point.usePoint(points);
        }

        return await this.pointHistoryRepository.create(point, tx);
    }
}