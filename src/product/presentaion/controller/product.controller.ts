import { Controller, Get, Query } from "@nestjs/common";
import { ProductService } from "../../domain/service/product.service";
import { GetProductsResponse } from "../dto/get-products.resp.dto";
import { PaginationQueryDto } from "../../../common/dto/pagination-query.dto";
import { ApiResponse } from "@nestjs/swagger";
import { ApiOperation } from "@nestjs/swagger";

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