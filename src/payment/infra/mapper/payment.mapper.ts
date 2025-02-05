import { PaymentMethod, PaymentModel, PaymentStatus } from "@/payment/domain/model/payment";
import { Payment } from "@prisma/client";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PaymentMapper {
    toDomain(payment: Payment): PaymentModel {
        return {
            id: payment.id,
            orderId: payment.orderId,
            amount: payment.amount,
            paymentMethod: payment.paymentMethod as PaymentMethod,
            paymentStatus: payment.paymentStatus as PaymentStatus,
            createdAt: payment.createdAt,
            updatedAt: payment.updatedAt
        };
    }
}