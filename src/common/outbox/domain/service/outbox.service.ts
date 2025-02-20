import { Inject, Injectable } from "@nestjs/common";
import { OUTBOX_REPOSITORY, OutboxRepository } from "../repository/outbox.repository";
import { Outbox } from "../model/outbox";

@Injectable()
export class OutboxService {
    constructor(
        @Inject(OUTBOX_REPOSITORY) private readonly outboxRepository: OutboxRepository
    ) {}

    async createOutbox(outbox: Outbox, tx?: any): Promise<Outbox> {
        return await this.outboxRepository.save(outbox, tx);
    }

    async updateOutbox(outbox: Outbox, tx?: any): Promise<Outbox> {
        return await this.outboxRepository.update(outbox, tx);
    }
}