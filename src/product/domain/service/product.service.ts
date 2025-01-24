import { Inject, Injectable, BadRequestException, Logger } from "@nestjs/common";
import { PRODUCT_REPOSITORY, ProductRepository } from "../repository/product.repository";
import { ProductModel } from "../model/product";
import { ProductsRespDto } from "@/product/presentation/dto/response/products.dto";
import { ProductDetailRespDto } from "@/product/presentation/dto/response/product-detail.dto";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";

@Injectable()
export class ProductService {
    constructor(
        @Inject(PRODUCT_REPOSITORY)
        private readonly productRepository: ProductRepository,
        @Inject(WINSTON_MODULE_PROVIDER)
        private readonly logger: Logger
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

    async getProductWithModel(productId: number, tx?: any): Promise<ProductModel> {
        return await this.productRepository.findById(productId, tx);
    }
    
    async getProductWithLock(productId: number, tx: any): Promise<ProductModel> {
        try {
            const product = await this.productRepository.findByIdWithLock(productId, tx);
            if (!product) {
                throw new BadRequestException('상품이 존재하지 않습니다.');
            }
            return product;
        } catch (error) {
            this.logger.warn(`Product not found: ${productId}`);
        }
    }

    async decreaseStock(product: ProductModel, amount: number, tx: any) {
        try {
            product.checkStock(amount);
            product.decreaseStock(amount);
            return await this.productRepository.updateStock(product.id, product.stock, tx);
        } catch (error) {
            this.logger.error(`Product stock decrease failed: ${product.id} ${amount}`);
            throw new BadRequestException('상품 재고 감소에 실패했습니다.');
        }
    }

    async validateProduct(product: ProductModel, amount: number) {
        if (!product) {
            throw new BadRequestException('상품이 존재하지 않습니다.');
        }

        product.checkAmount(amount);

        product.checkStock(amount);
    }
}