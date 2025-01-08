import { Module } from "@nestjs/common";
import { TRANSACTION_MANAGER } from "../common/transaction/domain/transaction.interface";
import { PrismaTransactionManager } from "../common/transaction/infra/prisma-transaction.manager";
import { ProductController } from "./presentaion/product.controller";
import { ProductService } from "./domain/service/product.service";
import { PRODUCT_REPOSITORY } from "./domain/repopsitory/product.service";
import { ProductPrismaRepository } from "./infra/repository/product.prisma.repository";

@Module({
    imports: [],
    providers: [
        {
            provide: TRANSACTION_MANAGER,
            useClass: PrismaTransactionManager
        },
        ProductService,
        {
            provide: PRODUCT_REPOSITORY,
            useClass: ProductPrismaRepository
        }
    ],
    controllers: [ProductController]
})
export class ProductModule {}