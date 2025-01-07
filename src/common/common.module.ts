import { Module, Global } from "@nestjs/common";
import { TRANSACTION_MANAGER } from "./transaction/domain/transaction.interface";
import { PrismaTransactionManager } from "./transaction/infra/prisma-transaction.manager";

@Global()
@Module({
    providers: [
        { provide: TRANSACTION_MANAGER, useClass: PrismaTransactionManager }
    ],
    exports: [
        { provide: TRANSACTION_MANAGER, useClass: PrismaTransactionManager }
    ]
})
export class CommonModule {}