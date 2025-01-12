import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { USER_REPOSITORY, UserRepositoryInterface } from "@/user/domain/repository/user.repository.interface";
import { UserModel } from "@/user/domain/model/user.model";
import { CreateUserReqDto } from "@/user/domain/dto/request/create-user-req.dto";

@Injectable()
export class UserService {

    constructor(@Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryInterface){}

    async getUser(userId: number, tx?: any): Promise<UserModel> {
        const user = await this.userRepository.findById(userId, tx);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }

    async getUserWithLock(userId: number, tx?: any): Promise<UserModel> {
        return await this.userRepository.findByIdWithLock(userId, tx);
    }

    async createUser(createUserDto: CreateUserReqDto): Promise<UserModel> {
        return await this.userRepository.create(createUserDto.toDomain());
    }

    async chargePoint(user: UserModel, amount: number, tx?: any) { 
        user.points += amount;
        return await this.userRepository.update(user, tx);
    }
}