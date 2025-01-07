import { PointHistory } from "@prisma/client";
import { CreatePointHistoryDto } from "./dto/create-point-history.dto";

export interface PointHistoryRepositoryInterface {
    create(createPointHistoryDto: CreatePointHistoryDto, tx?: any): Promise<PointHistory>;
}

export const POINT_HISTORY_REPOSITORY = Symbol('POINT_HISTORY_REPOSITORY');