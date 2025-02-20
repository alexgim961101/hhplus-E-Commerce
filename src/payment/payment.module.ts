import { Module } from "@nestjs/common";
import { PaymentFacadeService } from "@/payment/application/payment.facade";
import { PaymentController } from "@/payment/presentaion/controller/payment.controller";
import { PAYMENT_REPOSITORY } from "@/payment/domain/repository/payment.repository";
import { PaymentRepository } from "@/payment/infra/repository/payment.repository";
import { PaymentService } from "@/payment/domain/service/payment.service";
import { OrderModule } from "@/order/order.module";
import { PointModule } from "@/point/point.module";
import { PaymentMapper } from "@/payment/infra/mapper/payment.mapper";
import { MockService } from "@/common/mock/mock.service";
import { HttpModule } from "@nestjs/axios";
import { OutboxService } from "@/common/outbox/domain/service/outbox.service";

@Module({
    imports: [OrderModule, PointModule, HttpModule],
    providers: [
        PaymentFacadeService, 
        {
            provide: PAYMENT_REPOSITORY,
            useClass: PaymentRepository
        },
        PaymentService,
        PaymentMapper,
        MockService,
        OutboxService,
    ],
    controllers: [PaymentController],
})
export class PaymentModule {}