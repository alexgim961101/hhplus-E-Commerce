import { Module } from "@nestjs/common";
import { PointController } from "@/point/presentation/controller/point.controller";
import { UserModule } from "@/user/user.module";
import { PrismaModule } from "@/prisma/prisma.module";
import { PointMapper } from "@/point/infra/mapper/point.mapper";
import { POINT_HISTORY_REPOSITORY } from "@/point/domain/repository/point-history.repository";
import { PointHistoryPrismaRepository } from "@/point/infra/repository/point-history.prisma.repository";
import { PointService } from "@/point/domain/service/point.service";
import { PointFacade } from "@/point/application/facade/point.facade";

@Module({
    imports: [UserModule, PrismaModule],
    providers: [
        { provide: POINT_HISTORY_REPOSITORY, useClass: PointHistoryPrismaRepository }, 
        PointService, 
        PointFacade,
        PointMapper
    ],
    controllers: [PointController],
})
export class PointModule{}