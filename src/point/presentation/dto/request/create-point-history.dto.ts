import { TransactionType } from "@prisma/client";

export class CreatePointHistoryDto {
    userId: number;
    points: number;
    transactionType: TransactionType;
}