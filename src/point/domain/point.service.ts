import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { PointHistoryRepositoryInterface } from "./point-history.repository";
import { POINT_HISTORY_REPOSITORY } from "./point-history.repository";
import { TransactionType } from "@prisma/client";

@Injectable()
export class PointService {
    constructor(@Inject(POINT_HISTORY_REPOSITORY) private readonly pointHistoryRepository: PointHistoryRepositoryInterface){}

    async savePointHistory(userId: number, points: number, type: 'charge' | 'use', tx?: any) {
        return await this.pointHistoryRepository.create({
            userId,
            points,
            transactionType: type === 'charge' ? TransactionType.CHARGE : TransactionType.USE
        }, tx);
    }
}