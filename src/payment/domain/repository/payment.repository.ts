import { PaymentModel } from "@/payment/domain/model/payment";

export interface IPaymentRepository {
    savePayment(newPayment: PaymentModel, tx: any): Promise<PaymentModel>;
}

export const PAYMENT_REPOSITORY = Symbol('PAYMENT_REPOSITORY');