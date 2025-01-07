import { User } from "@prisma/client";
import { CreateUserDto } from "../presentation/dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

export interface UserRepositoryInterface {
    findById(id: number): Promise<User | null>;
    findAll(): Promise<User[]>;
    create(createUserDto: CreateUserDto): Promise<User>;
    update(userId: number, updateUserDto: UpdateUserDto): Promise<User>;
    delete(id: number): Promise<void>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');