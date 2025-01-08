import { Injectable } from "@nestjs/common";
import { ProductRepository } from "../../domain/repopsitory/product.service";
import { Product } from "@prisma/client";
import { PrismaService } from "../../../prisma/prisma.service";

@Injectable()
export class ProductPrismaRepository implements ProductRepository {

    constructor(private readonly prisma: PrismaService) {}
    async findAll(page: number, limit: number): Promise<Product[]> {
        return await this.prisma.product.findMany({
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
    async count(): Promise<number> {
        return await this.prisma.product.count();
    }

}