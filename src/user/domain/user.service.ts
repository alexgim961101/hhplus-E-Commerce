import { Inject, Injectable } from "@nestjs/common";
import { USER_REPOSITORY, UserRepositoryInterface } from "./user.repository.interface";
import { PrismaClient, User } from "@prisma/client";
import { CreateUserDto } from "../presentation/dto/create-user.dto";

@Injectable()
export class UserService {

    constructor(@Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryInterface){}

    async getUser(userId: number, tx?: any): Promise<User> {
        return await this.userRepository.findById(userId, tx);
    }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        return await this.userRepository.create(createUserDto);
    }

    async chargePoint(user: User, amount: number, tx?: any) { 
        user.points += amount;
        return await this.userRepository.update(user.id, { points: user.points }, tx);
    }
}