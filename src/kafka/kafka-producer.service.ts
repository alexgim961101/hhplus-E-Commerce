import { Inject, Injectable } from "@nestjs/common";
import { ClientKafka } from "@nestjs/microservices";
import { Observable } from "rxjs";

@Injectable()
export class KafkaProducerService {
    constructor(@Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka) {}

    async sendMessage(topic: string, message: string): Promise<Observable<any>> {
        return this.kafkaClient.emit(topic, JSON.stringify(message));
    }
}