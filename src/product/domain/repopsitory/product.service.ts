import { Product } from "@prisma/client";

export interface ProductRepository {
    updateStock(id: number, stock: number, tx: any): Promise<Product>;
    findByIdWithLock(productId: number, tx: any): Promise<Product>;
    findById(id: number, tx?: any): Promise<Product>
    findAll(page:number, limit:number, tx?: any): Promise<Product[]>
    count(tx?: any): Promise<number>
}

export const PRODUCT_REPOSITORY = Symbol('ProductRepository');