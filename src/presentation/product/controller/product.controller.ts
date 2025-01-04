import {
  Controller,
  Get,
  Param,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ProductDto } from "../dto/product.dto";

@ApiTags("Product")
@Controller("products")
export class ProductController {
  // Mock 데이터를 저장할 Map (실제로는 DB를 사용해야 함)
  private products: Map<number, ProductDto> = new Map();

  constructor() {
    // Mock 데이터 초기화
    this.products.set(1, {
      id: 1,
      name: "맥북 프로 16인치",
      price: 3600000,
      stock: 100,
    });
    this.products.set(2, {
      id: 2,
      name: "아이폰 15 Pro",
      price: 1600000,
      stock: 200,
    });
  }

  @Get(":productId")
  @ApiOperation({ summary: "상품 조회 API" })
  @ApiResponse({
    status: 200,
    description: "상품 조회 성공",
    type: ProductDto,
  })
  @ApiResponse({
    status: 404,
    description: "상품을 찾을 수 없음",
    schema: {
      example: {
        message: "존재하지 않는 상품입니다.",
        statusCode: 404,
      },
    },
  })
  async getProduct(@Param("productId") productId: string): Promise<ProductDto> {
    const productIdNum = Number(productId);
    const product = this.products.get(productIdNum);

    if (!product) {
      throw new HttpException(
        "존재하지 않는 상품입니다.",
        HttpStatus.NOT_FOUND
      );
    }

    return product;
  }
}
