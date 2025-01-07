import { User } from "@prisma/client";

export interface UserRepositoryInterface {
    findById(id: number): Promise<User | null>;
    findAll(): Promise<User[]>;
    create(user: User): Promise<User>;
    update(user: User): Promise<User>;
    delete(id: number): Promise<void>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');