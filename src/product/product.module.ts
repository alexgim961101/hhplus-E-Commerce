import { Module } from "@nestjs/common";
import { PrismaModule } from "@/prisma/prisma.module";
import { ProductController } from "@/product/presentation/controller/product.controller";
import { ProductService } from "@/product/domain/service/product.service";
import { PRODUCT_REPOSITORY } from "@/product/domain/repository/product.repository";
import { ProductPrismaRepository } from "@/product/infra/repository/product.prisma.repository";
import { ProductMapper } from "@/product/infra/mapper/prodcut.mapper";

@Module({
    imports: [PrismaModule],
    providers: [
        ProductService,
        ProductMapper,
        {
            provide: PRODUCT_REPOSITORY,
            useClass: ProductPrismaRepository
        }
    ],
    controllers: [ProductController],
    exports: [ProductService]
})
export class ProductModule {}