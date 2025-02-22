import { Inject, Injectable } from "@nestjs/common";
import { OUTBOX_REPOSITORY, OutboxRepository } from "../repository/outbox.repository";
import { Outbox } from "../model/outbox";
import { Cron, CronExpression } from "@nestjs/schedule";
import { KafkaProducerService } from "@/kafka/kafka-producer.service";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";

@Injectable()
export class OutboxService {
    constructor(
        @Inject(OUTBOX_REPOSITORY) private readonly outboxRepository: OutboxRepository,
        private readonly kafkaProducerService: KafkaProducerService,
        @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
    ) {}

    async createOutbox(outbox: Outbox, tx?: any): Promise<Outbox> {
        return await this.outboxRepository.save(outbox, tx);
    }

    async updateOutbox(outbox: Outbox, tx?: any): Promise<Outbox> {
        return await this.outboxRepository.update(outbox, tx);
    }

    @Cron(CronExpression.EVERY_5_MINUTES)
    async handleOutbox() {
        const events = await this.outboxRepository.findByStatus('queued');
        for (const event of events) {

            try {
                await this.kafkaProducerService.sendMessage(event.topic, event.message);
                this.outboxRepository.update(event, { status: 'processed', updatedAt: new Date() });
                this.logger.info(`Message sent to Kafka: ${event.topic} : ${event.message}`);
            } catch(error) {
                this.logger.error(`Failed to send message to Kafka: ${error}`);
            }
        }
    }
}