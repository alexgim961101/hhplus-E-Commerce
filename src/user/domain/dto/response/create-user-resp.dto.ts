import { UserModel } from "@/user/domain/model/user.model";

export class CreateUserRespDto {
    id: number;
    points: number;
    createdAt: Date;
    updatedAt: Date;

    static fromDomain(user: UserModel): CreateUserRespDto {
        return {
            id: user.id,
            points: user.points,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    }
}