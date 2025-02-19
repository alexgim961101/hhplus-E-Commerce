import { Global, Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { KafkaProducerService } from "./kafka-producer.service";
import { KafkaConsumerController } from "./kafka-consumer.service";


@Global()
@Module({
  imports: [
    ClientsModule.register(
        [
            {
                name: 'KAFKA_CLIENT',
                transport: Transport.KAFKA,
                options: {
                    client: {
                        clientId: 'nestjs-kafka',
                        brokers: ['localhost:9092'],
                    },
                    consumer: {
                        groupId: 'nestjs-kafka-consumer',
                    },
                },
            },
        ]
    )
  ],
  providers: [KafkaProducerService],
  controllers: [KafkaConsumerController],
  exports: [ClientsModule, KafkaProducerService],
})
export class KafkaModule {}