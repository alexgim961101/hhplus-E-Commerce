export enum PaymentMethod {
    CASH = 'CASH',
    CARD = 'CARD'
}

export enum PaymentStatus {
    SUCCESS = 'SUCCESS',
    PENDING = 'PENDING',
    FAILED = 'FAILED'
}

export class PaymentModel {
    id?: number;
    orderId?: number;
    paymentMethod?: PaymentMethod;
    amount?: number;
    paymentStatus?: PaymentStatus;
    createdAt?: Date;
    updatedAt?: Date;
    
    static createPayment(orderId: number, amount: number, paymentMethod: string): PaymentModel {
        return {
            orderId: orderId,
            amount,
            paymentMethod: paymentMethod === 'CASH' ? PaymentMethod.CASH : PaymentMethod.CARD,
            paymentStatus: PaymentStatus.PENDING,
            createdAt: new Date(),
        };
    }
}