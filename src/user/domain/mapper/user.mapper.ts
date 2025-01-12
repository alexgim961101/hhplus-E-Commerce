import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { UserModel } from "../model/user.model";

@Injectable()
export class UserMapper {
    toDomain(user: User): UserModel {
        return new UserModel({
            id: user.id,
            points: user.points,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });
    }

    toDomainList(users: User[]): UserModel[] {
        return users.map(user => this.toDomain(user));
    }
}