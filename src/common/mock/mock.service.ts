import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import MockAdapter from "axios-mock-adapter";

@Injectable()
export class MockService {
    private mock: MockAdapter;

    constructor(private readonly httpService: HttpService) {
        this.mock = new MockAdapter(this.httpService.axiosRef);
        
        // Mock API 응답 설정
        this.mock.onPost('/api/payment/notify').reply(200, {
            success: true,
            message: 'Payment notification received'
        });
    }


    async sendPaymentInfo(paymentId: number): Promise<void> {
        // TODO: 결제 정보 전송
        this.httpService.post('/api/payment/notify', { paymentId });
    }
}