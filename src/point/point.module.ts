import { Module } from "@nestjs/common";
import { POINT_HISTORY_REPOSITORY } from "./domain/point-history.repository";
import { PointHistoryPrismaRepository } from "./infra/point-history.prisma.repository";
import { PointService } from "./domain/point.service";
import { PointController } from "./presentation/controller/point.controller";
import { UserModule } from "../user/user.module";
import { PointFacade } from "./application/point.facade";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
    imports: [UserModule, PrismaModule],
    providers: [
        { provide: POINT_HISTORY_REPOSITORY, useClass: PointHistoryPrismaRepository }, 
        PointService, 
        PointFacade
    ],
    controllers: [PointController],
})
export class PointModule{}