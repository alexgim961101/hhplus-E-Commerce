import { Injectable } from "@nestjs/common";
import { ProductModel } from "@/product/domain/model/product";
import { Product } from "@prisma/client";

@Injectable()
export class ProductMapper {
    toDomain(product: Product): ProductModel {
        return new ProductModel({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock
        });
    }

    toDomainList(products: Product[]): ProductModel[] {
        return products.map(product => this.toDomain(product));
    }
}