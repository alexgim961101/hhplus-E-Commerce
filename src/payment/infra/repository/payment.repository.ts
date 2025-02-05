import { PaymentModel } from "@/payment/domain/model/payment";
import { IPaymentRepository } from "@/payment/domain/repository/payment.repository";
import { PrismaService } from "@/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { PaymentMethod, PaymentStatus } from "@prisma/client";
import { PaymentMapper } from "@/payment/infra/mapper/payment.mapper";

@Injectable()
export class PaymentRepository implements IPaymentRepository {

    constructor(private readonly prisma: PrismaService, private readonly paymentMapper: PaymentMapper) {}

    async savePayment(newPayment: PaymentModel, tx: any): Promise<PaymentModel> {
        const prisma = tx || this.prisma;
        const payment = await prisma.payment.create({
            data: {
                orderId: newPayment.orderId,
                amount: newPayment.amount,
                paymentMethod: newPayment.paymentMethod as PaymentMethod,
                paymentStatus: newPayment.paymentStatus as PaymentStatus,
                createdAt: newPayment.createdAt,
            }
        });

        return this.paymentMapper.toDomain(payment);
    }
}