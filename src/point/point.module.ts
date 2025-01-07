import { Module } from "@nestjs/common";
import { POINT_HISTORY_REPOSITORY } from "./domain/point-history.repository";
import { PointHistoryPrismaRepository } from "./infra/point-history.prisma.repository";
import { PointService } from "./domain/point.service";
import { PointController } from "./presentation/point.controller";
import { UserModule } from "src/user/user.module";
import { PointFacade } from "./application/point.facade";
import { TRANSACTION_MANAGER } from "src/common/transaction/domain/transaction.interface";
import { PrismaTransactionManager } from "src/common/transaction/infra/prisma-transaction.manager";

@Module({
    imports: [UserModule],
    providers: [
        { provide: POINT_HISTORY_REPOSITORY, useClass: PointHistoryPrismaRepository }, 
        PointService, 
        PointFacade, 
        { provide: TRANSACTION_MANAGER, useClass: PrismaTransactionManager }
    ],
    controllers: [PointController],
})
export class PointModule{}