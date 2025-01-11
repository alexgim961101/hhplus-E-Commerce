import { Module } from "@nestjs/common";
import { POINT_HISTORY_REPOSITORY } from "@/point/domain/point-history.repository";
import { PointHistoryPrismaRepository } from "@/point/infra/point-history.prisma.repository";
import { PointService } from "@/point/domain/point.service";
import { PointController } from "@/point/presentation/controller/point.controller";
import { UserModule } from "@/user/user.module";
import { PointFacade } from "@/point/application/point.facade";
import { PrismaModule } from "@/prisma/prisma.module";

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