import { User } from "../../domain/user.domain";
import { User as UserEntity } from "@prisma/client";

export class UserMapper {
    static toDomain(user: UserEntity): User {
        return {
            id: user.id,
            points: user.points,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}
