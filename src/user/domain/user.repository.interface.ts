import { User } from "@prisma/client";
import { CreateUserDto } from "@/user/domain/dto/create-user.dto";
import { UpdateUserDto } from "@/user/domain/dto/update-user.dto";

export interface UserRepositoryInterface {
    findById(id: number, tx?: any): Promise<User | null>;
    findByIdWithLock(id: number, tx?: any): Promise<User | null>;
    findAll(): Promise<User[]>;
    create(createUserDto: CreateUserDto): Promise<User>;
    update(userId: number, updateUserDto: UpdateUserDto, tx?: any): Promise<User>;
    delete(id: number): Promise<void>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');