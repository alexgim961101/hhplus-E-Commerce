import { Injectable } from "@nestjs/common";
import { PaymentService } from "@/payment/domain/service/payment.service";
import { PaymentModel } from "../domain/model/payment";
import { OrderService } from "@/order/domain/service/order.service";
import { PointService } from "@/point/domain/service/point.service";
import { MockService } from "@/common/mock/mock.service";
import { PrismaService } from "@/prisma/prisma.service";
import { OutboxService } from "@/common/outbox/domain/service/outbox.service";
import { Status } from "@/common/outbox/domain/model/outbox";
import { KafkaProducerService } from "@/kafka/kafka-producer.service";

@Injectable()
export class PaymentFacadeService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly paymentService: PaymentService,
        private readonly orderService: OrderService,
        private readonly pointService: PointService,
        private readonly mockService: MockService,
        private readonly outboxService: OutboxService,
        private readonly kafkaProducerService: KafkaProducerService
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

            // Mock Platform에 이벤트 발행
            // 1. Outbox 테이블에 레코드 생성
            await this.outboxService.createOutbox({
                topic: 'payment',
                message: JSON.stringify(payment),
                status: Status.QUEUED
            }, tx);

            // 2. Mock Platform에 이벤트 발행
            this.kafkaProducerService.sendMessage('payment', JSON.stringify(payment));

            return payment;
        });
    }
}