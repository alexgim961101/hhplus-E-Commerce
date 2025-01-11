import { Controller, Get, Query } from "@nestjs/common";
import { ProductService } from "@/product/domain/service/product.service";
import { PaginationQueryDto } from "@/common/dto/pagination-query.dto";
import { ApiResponse, ApiOperation } from "@nestjs/swagger";
import { GetProductsResponse } from "../dto/get-products.resp.dto";

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @ApiOperation({ summary: '상품 목록 조회', description: '상품 목록을 조회합니다.' })
    @ApiResponse({ 
        status: 200, 
        description: '상품 목록 조회 성공',
        type: GetProductsResponse 
    })
    @Get()
    async getProducts(@Query() query: PaginationQueryDto): Promise<GetProductsResponse> {
        return await this.productService.getProducts(query.page, query.limit);
    }
}