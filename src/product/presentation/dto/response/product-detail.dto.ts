import { ProductModel } from "@/product/domain/model/product";

export class ProductDetailRespDto {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    createdAt: Date;
    updatedAt: Date;

    static fromDomain(product: ProductModel): ProductDetailRespDto {
        return {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        }
    }
}