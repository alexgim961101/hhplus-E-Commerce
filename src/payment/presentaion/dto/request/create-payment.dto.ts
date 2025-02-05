// TODO: validation 필요
export class CreatePaymentReqDto {
    userId: number;
    orderId: number;
    paymentMethod: string;
}