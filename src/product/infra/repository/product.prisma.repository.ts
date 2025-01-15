import { Injectable } from "@nestjs/common";
import { ProductRepository } from "@/product/domain/repository/product.repository";
import { PrismaService } from "@/prisma/prisma.service";
import { ProductModel } from "@/product/domain/model/product";
import { ProductMapper } from "@/product/infra/mapper/prodcut.mapper";
import { Product } from "@prisma/client";

@Injectable()
export class ProductPrismaRepository implements ProductRepository {

    constructor(private readonly prisma: PrismaService, private readonly productMapper: ProductMapper) {}

    async findAll(page: number, limit: number, tx?: any): Promise<ProductModel[]> {
        const prisma = tx || this.prisma;

        const products = await prisma.product.findMany({
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                createdAt: 'desc'
            }
        });

        return this.productMapper.toDomainList(products);
    }

    async count(tx?: any): Promise<number> {
        const prisma = tx || this.prisma;
        return await prisma.product.count();
    }

    async findById(id: number, tx?: any): Promise<ProductModel> {
        const prisma = tx || this.prisma;
        const product = await prisma.product.findUnique({
            where: {
                id
            }
        });
        return this.productMapper.toDomain(product);
    }

    async findByIdWithLock(productId: number, tx: any): Promise<ProductModel> {
        const prisma = tx || this.prisma;
        const product = await prisma.$queryRaw<Product[]>`
            SELECT * FROM Product WHERE id = ${productId} FOR UPDATE;
        `
        return this.productMapper.toDomain(product[0]);
    }

    async updateStock(id: number, stock: number, tx: any): Promise<ProductModel> {
        const prisma = tx || this.prisma;
        const product = await prisma.product.update({
            where: {
                id
            },
            data: {
                stock
            }
        });
        return this.productMapper.toDomain(product);
    }
}