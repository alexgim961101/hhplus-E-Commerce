import { ProductModel } from "@/product/domain/model/product";

export interface ProductRepository {
    updateStock(id: number, stock: number, tx: any): Promise<ProductModel>;
    findByIdWithLock(productId: number, tx: any): Promise<ProductModel>;
    findById(id: number, tx?: any): Promise<ProductModel>
    findAll(page:number, limit:number, tx?: any): Promise<ProductModel[]>
    count(tx?: any): Promise<number>
}
export const PRODUCT_REPOSITORY = Symbol('ProductRepository');