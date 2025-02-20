import { Inject, Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import MockAdapter from "axios-mock-adapter";
import { MessagePattern } from "@nestjs/microservices";
import { PaymentModel } from "@/payment/domain/model/payment";
import { Logger } from "winston";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";

@Injectable()
export class MockService {
    private mock: MockAdapter;

    constructor(private readonly httpService: HttpService, @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {
        this.mock = new MockAdapter(this.httpService.axiosRef);
        
        // Mock API 응답 설정
        this.mock.onPost('/api/payment/notify').reply(200, {
            success: true,
            message: 'Payment notification received'
        });
    }


    @MessagePattern('payment')
    async sendPaymentInfo(payment: PaymentModel): Promise<void> {
        // TODO: 결제 정보 전송
        this.logger.info(`Sending payment info: ${JSON.stringify(payment)}`);
        this.httpService.post('/api/payment/notify', { payment });
    }
}