import { OutboxRepository } from "@/common/outbox/domain/repository/outbox.repository";
import { Outbox, Status } from "@/common/outbox/domain/model/outbox";
import { PrismaService } from "@/prisma/prisma.service";
import { OutboxMapper } from "../mapper/outbox.mapper";

export class OutboxPrismaRepository implements OutboxRepository {
    constructor(private readonly prisma: PrismaService, private readonly outboxMapper: OutboxMapper) {}

    async save(outbox: Outbox, tx?: any): Promise<Outbox> {
        const prisma = tx || this.prisma;
        const outboxModel = prisma.outBox.create({ data: outbox });
        return this.outboxMapper.toDomain(outboxModel);
    }
    async update(outbox: Outbox, tx?: any): Promise<Outbox> {
        const prisma = tx || this.prisma;
        const outboxModel = prisma.outBox.update({ where: { id: outbox.id }, data: outbox });
        return this.outboxMapper.toDomain(outboxModel);
    }

    async findByStatus(status: string, tx?: any): Promise<Outbox[]> {
        const prisma = tx || this.prisma;
        const outboxes = prisma.outBox.findMany({
            where: {
                status,
            }
        });
        return outboxes.map(this.outboxMapper.toDomain);
    }
}