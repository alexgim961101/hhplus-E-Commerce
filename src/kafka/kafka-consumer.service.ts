import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";

@Controller()
export class KafkaConsumerController {

    @MessagePattern('test')
    handleTest(data: any) {
        console.log(`Received message: ${JSON.stringify(data)}`);
    }
}