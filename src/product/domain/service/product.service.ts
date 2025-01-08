import { Inject, Injectable } from "@nestjs/common";
import { PRODUCT_REPOSITORY, ProductRepository } from "../repopsitory/product.service";

@Injectable()
export class ProductService {
    constructor(
        @Inject(PRODUCT_REPOSITORY)
        private readonly productRepository: ProductRepository
    ) {}

    async getProducts(page: number, limit: number) {
        // 1. 전체 상품 수 조회
        const totalCount = await this.productRepository.count();

        // 2. 페이지네이션 상품 목록 조회
        const products = await this.productRepository.findAll(page, limit);

        // 3. 전체 페이지 수 계산
        const totalPages = Math.ceil(totalCount / limit);

        // 4. return
        return {
            products,
            totalPages,
            currentPage: page,
            totalCount
        }
    }
}