import { Controller, Get, Query } from "@nestjs/common";
import { ProductService } from "../domain/service/product.service";
import { GetProductsResponse } from "./dto/get-products.resp.dto";
import { PaginationQueryDto } from "src/common/dto/pagiantion-query.dto";

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get()
    async getProducts(@Query() query: PaginationQueryDto): Promise<GetProductsResponse> {
        return await this.productService.getProducts(query.page, query.limit);
    }
}