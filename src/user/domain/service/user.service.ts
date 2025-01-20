import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { USER_REPOSITORY, UserRepositoryInterface } from "@/user/domain/repository/user.repository.interface";
import { UserModel } from "@/user/domain/model/user.model";
import { CreateUserReqDto } from "@/user/presentation/dto/request/create-user-req.dto";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";

@Injectable()
export class UserService {

    constructor(@Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryInterface, @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger){}

    async getUser(userId: number) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundException(`User with id ${userId} not found`);
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