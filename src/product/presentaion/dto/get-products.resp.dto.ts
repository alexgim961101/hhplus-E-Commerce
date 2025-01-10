import { ApiProperty } from '@nestjs/swagger';
import { Product } from '@prisma/client';
import { ProductDto } from './product.dto';

export class GetProductsResponse {
    @ApiProperty({ 
        type: [ProductDto],
        description: '상품 목록' 
    })
    products: Product[];

    @ApiProperty({ 
        type: Number,
        description: '전체 페이지 수' 
    })
    totalPages: number;

    @ApiProperty({ 
        type: Number,
        description: '현재 페이지 번호' 
    })
    currentPage: number;

    @ApiProperty({ 
        type: Number,
        description: '전체 상품 수' 
    })
    totalCount: number;
} 