import { IPaymentRepository } from "@/payment/domain/repository/payment.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PaymentRepository implements IPaymentRepository {}