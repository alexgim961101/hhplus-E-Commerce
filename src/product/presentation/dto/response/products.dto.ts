import { ProductModel } from "@/product/domain/model/product";

export class ProductsRespDto {
    products: ProductModel[];
    totalPages: number;
    currentPage: number;
    totalCount: number;
}