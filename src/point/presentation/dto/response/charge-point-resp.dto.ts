import { PointModel } from "@/point/domain/model/point";
import { ApiProperty } from "@nestjs/swagger";
import { PointHistory } from "@prisma/client";

export class ChargePointResponseDto {
    @ApiProperty({
        type: Number,
        description: '포인트 히스토리 ID'
    })
    id: number

    @ApiProperty({
        type: Number,
        description: '사용자 ID'
    })
    userId: number

    @ApiProperty({
        type: Number,
        description: '충전된 포인트'
    })
    point: number;

    @ApiProperty({
        type: String,
        description: '트랜잭션 유형'
    })
    transactionType: string

    static from(point: PointModel): ChargePointResponseDto {
        return {
            id: point.id,
            userId: point.userId,
            point: point.points,
            transactionType: point.transactionType as unknown as string,
        };
    }
}