export class PaymentMethod {
    CASH = 'CASH';
    CARD = 'CARD';
}

export class PaymentStatus {
    SUCCESS = 'SUCCESS';
    PENDING = 'PENDING';
    FAILED = 'FAILED';
}

export class PaymentModel {
    id: number;
    orderId: number;
    paymentMethod: PaymentMethod;
    amount: number;
    paymentStatus: PaymentStatus;
    createdAt: Date;
    updatedAt: Date;
}