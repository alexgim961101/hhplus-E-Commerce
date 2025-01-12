import { Controller, Get, Param, Query } from "@nestjs/common";
import { ProductService } from "@/product/domain/service/product.service";
import { PaginationQueryDto } from "@/common/dto/pagination-query.dto";
import { ApiResponse, ApiOperation } from "@nestjs/swagger";
import { ProductDetailRespDto } from "@/product/presentation/dto/response/product-detail.dto";
import { ProductsRespDto } from "@/product/presentation/dto/response/products.dto";

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @ApiOperation({ summary: '상품 목록 조회', description: '상품 목록을 조회합니다.' })
    @ApiResponse({ 
        status: 200, 
        description: '상품 목록 조회 성공',
        type: ProductsRespDto
    })
    @Get()
    async getProducts(@Query() query: PaginationQueryDto): Promise<ProductsRespDto> {
        return await this.productService.getProducts(query.page, query.limit);
    }

    @ApiOperation({ summary: '특정 상품 디테일 조회', description: '특정 상품의 디테일을 조회합니다.' })
    @ApiResponse({ 
        status: 200, 
        description: '상품 디테일 조회 성공',
        type: ProductDetailRespDto
    })
    @Get(':productId')
    async getProductDetail(@Param('productId') productId: number): Promise<ProductDetailRespDto> {
        return await this.productService.getProduct(productId);
    }
}