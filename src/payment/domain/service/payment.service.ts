import { Inject, Injectable } from "@nestjs/common";
import { PAYMENT_REPOSITORY } from "@/payment/domain/repository/payment.repository";
import { IPaymentRepository } from "@/payment/domain/repository/payment.repository";
import { PaymentModel } from "../model/payment";

@Injectable()
export class PaymentService {
    constructor(
        @Inject(PAYMENT_REPOSITORY)
        private readonly paymentRepository: IPaymentRepository
    ) {}

    async createPayment(newPayment: PaymentModel, tx: any): Promise<PaymentModel> {
        return await this.paymentRepository.savePayment(newPayment, tx);
    }
}