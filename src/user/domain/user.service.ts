import { Inject, Injectable } from "@nestjs/common";
import { USER_REPOSITORY, UserRepositoryInterface } from "./user.repository.interface";
import { User } from "@prisma/client";
import { CreateUserDto } from "../presentation/dto/create-user.dto";

@Injectable()
export class UserService {

    constructor(@Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryInterface){}

    async getUser(userId: number): Promise<User> {
        return await this.userRepository.findById(userId);
    }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        return await this.userRepository.create(createUserDto);
    }

    async chargePoint(user: User, amount: number) { 
        user.points += amount;
        return await this.userRepository.update(user.id, { points: user.points });
    }
}