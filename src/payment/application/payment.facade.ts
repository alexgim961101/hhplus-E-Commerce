import { Injectable } from "@nestjs/common";
import { PaymentService } from "@/payment/domain/service/payment.service";
import { PaymentModel } from "../domain/model/payment";
import { OrderService } from "@/order/domain/service/order.service";
import { PointService } from "@/point/domain/service/point.service";

@Injectable()
export class PaymentFacadeService {
    constructor(
        private readonly paymentService: PaymentService,
        private readonly orderService: OrderService,
        private readonly pointService: PointService
    ) {}

    /**
     * 결제 생성
     * 
     * 0. 주문 불러와서 총 주문 금액 확인
     * 1. 결제 생성
     * 2. 포인트 삭감
     * 3. Mock API 호출
     */
    async createPayment(orderId: number, paymentMethod: string): Promise<PaymentModel> {
        // 주문 불러와서 총 주문 금액 확인
        const amount = await this.orderService.getOrderAmount(orderId);

        // 결제 생성
        const newPayment = new PaymentModel()
        newPayment.createPayment(orderId, amount, paymentMethod);
        const payment = await this.paymentService.createPayment(newPayment);

        // 포인트 삭감
        await this.pointService.usePoint(orderId, amount);

        // Mock API 호출
        this.mockApiService.callMockApi(payment.id);

        return payment;
    }
}