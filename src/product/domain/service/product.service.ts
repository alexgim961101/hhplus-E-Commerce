import { Inject, Injectable, BadRequestException } from "@nestjs/common";
import { Product } from "@prisma/client";
import { PRODUCT_REPOSITORY, ProductRepository } from "../repository/product.repository";

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

    async getProduct(productId: number, tx?: any): Promise<Product> {
        return await this.productRepository.findById(productId, tx);
    }

    async getProductWithLock(productId: number, tx: any) {
        return await this.productRepository.findByIdWithLock(productId, tx);
    }

    async decreaseStock(id: number, stock: number, tx: any) {
        return await this.productRepository.updateStock(id, stock, tx);
    }

    async validateProduct(product: Product, amount: number) {
        if (!product) {
            throw new BadRequestException('상품이 존재하지 않습니다.');
        }

        if (amount <= 0) {
            throw new BadRequestException('잘못된 주문 요청입니다.');
        }

        if (product.stock < amount) {
            throw new BadRequestException('상품 수량이 부족합니다.');
        }
    }
}