import { Controller, Inject } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";

@Controller()
export class KafkaConsumerController {

    constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

    @MessagePattern('test')
    handleTest(data: any) {
        this.logger.info(`Received message: ${JSON.stringify(data)}`);
    }
}