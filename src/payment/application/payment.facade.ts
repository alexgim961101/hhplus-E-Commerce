import { Injectable } from "@nestjs/common";
import { PaymentService } from "@/payment/domain/service/payment.service";
import { PaymentModel } from "../domain/model/payment";
import { OrderService } from "@/order/domain/service/order.service";
import { PointService } from "@/point/domain/service/point.service";
import { MockService } from "@/common/mock/mock.service";
import { PrismaService } from "@/prisma/prisma.service";

@Injectable()
export class PaymentFacadeService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly paymentService: PaymentService,
        private readonly orderService: OrderService,
        private readonly pointService: PointService,
        private readonly mockService: MockService
    ) {}

    /**
     * 결제 생성
     * 
     * 0. 주문 불러와서 총 주문 금액 확인
     * 1. 결제 생성
     * 2. 포인트 삭감
     * 3. Mock API 호출
     */
    async createPayment(userId: number, orderId: number, paymentMethod: string): Promise<PaymentModel> {

        return this.prisma.runInTransaction(async (tx) => {
            // 주문 불러와서 총 주문 금액 확인
            const amount = await this.orderService.getOrderAmount(orderId, tx);

            // 결제 생성
            const newPayment = PaymentModel.createPayment(orderId, amount, paymentMethod);
            const payment = await this.paymentService.createPayment(newPayment, tx);

            // 포인트 삭감
            await this.pointService.savePointHistory(userId, amount, 'use', tx);

            // Mock API 호출
            this.mockService.sendPaymentInfo(payment.id);

            return payment;
        });
    }
}