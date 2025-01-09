import { ApiProperty } from "@nestjs/swagger";
import { User } from "@prisma/client";

export class CreateUserRespDto {

    @ApiProperty({
        example: 1,
        description: '사용자 ID'
    })
    userId: number;

    @ApiProperty({
        example: 10000,
        description: '보유 포인트'
    })
    points: number;

    @ApiProperty({
        example: '2024-03-14T12:00:00Z',
        description: '생성 일시'
    })
    createdAt: Date;

    static from(user: User): CreateUserRespDto {
        return {
            userId: user.id,
            points: user.points,
            createdAt: user.createdAt,
        };
    }
}