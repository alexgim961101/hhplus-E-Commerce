import { Inject, Injectable } from "@nestjs/common";
import { OUTBOX_REPOSITORY, OutboxRepository } from "../repository/outbox.repository";

@Injectable()
export class OutboxService {
    constructor(
        @Inject(OUTBOX_REPOSITORY) private readonly outboxRepository: OutboxRepository
    ) {}
}