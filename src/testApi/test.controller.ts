import { KafkaProducerService } from "@/kafka/kafka-producer.service";
import { Body, Controller, Post } from "@nestjs/common";

@Controller('test')
export class TestController {
    constructor(private readonly kafkaProcuder: KafkaProducerService) {}

    @Post('send-message')
    async sendMessage(@Body() body: any) {
        this.kafkaProcuder.sendMessage('test', body)
        return { success: true }
    }
}