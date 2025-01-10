import { Injectable } from "@nestjs/common";
import { ProductRepository } from "../../domain/repopsitory/product.service";
import { Product } from "@prisma/client";
import { PrismaService } from "../../../prisma/prisma.service";

@Injectable()
export class ProductPrismaRepository implements ProductRepository {

    constructor(private readonly prisma: PrismaService) {}

    async findAll(page: number, limit: number, tx?: any): Promise<Product[]> {
        const prisma = tx || this.prisma;
        return await prisma.product.findMany({
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    async count(tx?: any): Promise<number> {
        const prisma = tx || this.prisma;
        return await prisma.product.count();
    }

    async findById(id: number, tx?: any): Promise<Product> {
        const prisma = tx || this.prisma;
        return await prisma.product.findUnique({
            where: {
                id
            }
        });
    }

    async findByIdWithLock(productId: number, tx: any): Promise<Product> {
        const prisma = tx || this.prisma;
        return await prisma.$queryRaw`
            SELECT * FROM product WHERE id = ${productId} FOR UPDATE;
        `
    }

    async updateStock(id: number, stock: number, tx: any): Promise<Product> {
        const prisma = tx || this.prisma;
        return await prisma.product.update({
            where: {
                id
            },
            data: {
                stock
            }
        });
    }
}