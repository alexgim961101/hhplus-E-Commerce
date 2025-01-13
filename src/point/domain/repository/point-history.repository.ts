import { PointModel } from "@/point/domain/model/point";

export interface PointHistoryRepositoryInterface {
    create(point: PointModel, tx?: any): Promise<PointModel>;
}

export const POINT_HISTORY_REPOSITORY = Symbol('POINT_HISTORY_REPOSITORY');