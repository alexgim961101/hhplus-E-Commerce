import { PaymentModel } from "@/payment/domain/model/payment";

export class CreatePaymentResDto {
    constructor(payment: PaymentModel) {
        this.paymentId = payment.id;
    }

    paymentId: number;
}