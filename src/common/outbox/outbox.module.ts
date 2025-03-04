import { Global, Module } from "@nestjs/common";
import { OutboxPrismaRepository } from "@/common/outbox/infra/repository/outbox.prisma.repository";
import { OUTBOX_REPOSITORY } from "@/common/outbox/domain/repository/outbox.repository";
import { OutboxService } from "@/common/outbox/domain/service/outbox.service";
import { OutboxMapper } from "@/common/outbox/infra/mapper/outbox.mapper";
import { ScheduleModule } from "@nestjs/schedule";
import { KafkaModule } from "@/kafka/kafka.module";

@Global()
@Module({
    imports: [
        ScheduleModule.forRoot()
    ],
    providers: [
        { provide: OUTBOX_REPOSITORY, useClass: OutboxPrismaRepository },
        OutboxService,
        OutboxMapper
    ],
    exports: [OUTBOX_REPOSITORY]
})
export class OutboxModule {}