import { ApiProperty } from "@nestjs/swagger";
import { User } from "@prisma/client";

export class GetPointResponseDto {
    @ApiProperty({
        type: Number,
        description: '사용자 ID'
    })
    userId: number;

    @ApiProperty({
        type: Number,
        description: '사용자 포인트'
    })
    point: number;

    static from(userId: number, point: number): GetPointResponseDto {
        return { 
            userId,
            point
         };
    }
}