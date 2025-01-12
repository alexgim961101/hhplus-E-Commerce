import { UserModel } from "@/user/domain/model/user.model";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserReqDto {
    @ApiProperty({
        description: '초기 포인트',
        example: 0,
        required: false,
        default: 0
    })
    points?: number;

    toDomain(): UserModel {
        return new UserModel({
            points: this.points
        });
    }
}