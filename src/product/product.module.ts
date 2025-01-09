import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { ProductController } from "./presentaion/controller/product.controller";
import { ProductService } from "./domain/service/product.service";
import { PRODUCT_REPOSITORY } from "./domain/repopsitory/product.service";
import { ProductPrismaRepository } from "./infra/repository/product.prisma.repository";

@Module({
    imports: [PrismaModule],
    providers: [
        ProductService,
        {
            provide: PRODUCT_REPOSITORY,
            useClass: ProductPrismaRepository
        }
    ],
    controllers: [ProductController]
})
export class ProductModule {}