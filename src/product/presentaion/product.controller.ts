import { Controller, Get, Query } from "@nestjs/common";
import { ProductService } from "../domain/service/product.service";
import { GetProductsQuery } from "./dto/get-product.req.dto";

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get()
    async getProducts(@Query() query: GetProductsQuery) {
        return await this.productService.getProducts(query.page, query.limit);
    }
}