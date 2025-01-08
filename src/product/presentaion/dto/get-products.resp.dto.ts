import { Product } from "@prisma/client";

export class GetProductsResponse {
    products: Product[];
    totalPages: number;
    currentPage: number;
    totalCount: number;
}