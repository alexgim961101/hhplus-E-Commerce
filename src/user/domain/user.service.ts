import { Inject, Injectable } from "@nestjs/common";
import { USER_REPOSITORY, UserRepositoryInterface } from "./user.repository.interface";
import { User } from "@prisma/client";
import { CreateUserDto } from "../presentation/dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UserService {

    constructor(@Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryInterface){}

    async getUser(userId: number, tx?: any): Promise<User> {
        return await this.userRepository.findById(userId, tx);
    }

    async getUserWithLock(userId: number, tx?: any): Promise<User> {
        return await this.userRepository.findByIdWithLock(userId, tx);
    }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        return await this.userRepository.create(createUserDto);
    }

    async chargePoint(user: User, amount: number, tx?: any) { 
        user.points += amount;
        return await this.userRepository.update(user.id, new UpdateUserDto(user.points), tx);
    }
}