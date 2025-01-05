import { User } from "../../domain/user.domain";

export interface IUserRepository {
    findAll(): Promise<User[]>;
}

export const USER_REPOSITORY = Symbol("USER_REPOSITORY");