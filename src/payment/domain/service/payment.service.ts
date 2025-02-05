import { Inject, Injectable } from "@nestjs/common";
import { PAYMENT_REPOSITORY } from "@/payment/domain/repository/payment.repository";
import { IPaymentRepository } from "@/payment/domain/repository/payment.repository";

@Injectable()
export class PaymentService {
    constructor(
        @Inject(PAYMENT_REPOSITORY)
        private readonly paymentRepository: IPaymentRepository
    ) {}
}