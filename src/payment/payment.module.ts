import { Module } from "@nestjs/common";
import { PaymentFacadeService } from "@/payment/application/payment.facade";
import { PaymentController } from "@/payment/presentaion/controller/payment.controller";
import { PAYMENT_REPOSITORY } from "@/payment/domain/repository/payment.repository";
import { PaymentRepository } from "@/payment/infra/repository/payment.repository";
import { PaymentService } from "@/payment/domain/service/payment.service";
import { OrderModule } from "@/order/order.module";
import { PointModule } from "@/point/point.module";

@Module({
    imports: [OrderModule, PointModule],
    providers: [
        PaymentFacadeService, 
        {
            provide: PAYMENT_REPOSITORY,
            useClass: PaymentRepository
        },
        PaymentService
    ],
    controllers: [PaymentController],
})
export class PaymentModule {}