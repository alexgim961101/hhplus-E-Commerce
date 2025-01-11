import { ApiProperty } from "@nestjs/swagger";

export class ProductDto {
    @ApiProperty({
        type: Number,
        description: '상품 ID'
    })
    id: number;
    @ApiProperty({
        type: String,
        description: '상품 이름'
    })
    name: string;
    @ApiProperty({
        type: Number,
        description: '상품 가격'
    })
    price: number;
    @ApiProperty({
        type: Number,
        description: '상품 재고'
    })
    stock: number;
    @ApiProperty({
        type: String,
        description: '상품 설명'
    })
    description: string;
}