import { UserModel } from "@/user/domain/model/user.model";

export class GetUserRespDto {
    id: number;
    points: number;
    createdAt: Date;
    updatedAt: Date;

    static fromDomain(user: UserModel): GetUserRespDto {
        return {
            id: user.id,
            points: user.points,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    }
}