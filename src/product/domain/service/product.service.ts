import { Inject, Injectable, BadRequestException } from "@nestjs/common";
import { PRODUCT_REPOSITORY, ProductRepository } from "../repository/product.repository";
import { ProductModel } from "../model/product";
import { ProductsRespDto } from "@/product/presentation/dto/response/products.dto";
import { ProductDetailRespDto } from "@/product/presentation/dto/response/product-detail.dto";

@Injectable()
export class ProductService {
    constructor(
        @Inject(PRODUCT_REPOSITORY)
        private readonly productRepository: ProductRepository
    ) {}

    async getProducts(page: number, limit: number): Promise<ProductsRespDto> {
        const totalCount = await this.productRepository.count();

        const products = await this.productRepository.findAll(page, limit);

        const totalPages = Math.ceil(totalCount / limit);

        return {
            products,
            totalPages,
            currentPage: page,
            totalCount
        }
    }

    async getProduct(productId: number, tx?: any): Promise<ProductDetailRespDto> {
        const product = await this.productRepository.findById(productId, tx);
        return ProductDetailRespDto.fromDomain(product);
    }

    async getProductWithLock(productId: number, tx: any): Promise<ProductModel> {
        const product = await this.productRepository.findByIdWithLock(productId, tx);
        if (!product) {
            throw new BadRequestException('상품이 존재하지 않습니다.');
        }
        return product;
    }

    async decreaseStock(product: ProductModel, amount: number, tx: any) {
        product.checkStock(amount);
        product.decreaseStock(amount);
        return await this.productRepository.updateStock(product.id, product.stock, tx);
    }

    async validateProduct(product: ProductModel, amount: number) {
        if (!product) {
            throw new BadRequestException('상품이 존재하지 않습니다.');
        }

        product.checkAmount(amount);

        product.checkStock(amount);
    }
}