import { Product } from "@prisma/client";

export interface ProductRepository {
    findAll(page:number, limit:number): Promise<Product[]>
    count(): Promise<number>
}

export const PRODUCT_REPOSITORY = Symbol('ProductRepository');