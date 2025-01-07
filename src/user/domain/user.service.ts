import { Inject, Injectable } from "@nestjs/common";
import { USER_REPOSITORY, UserRepositoryInterface } from "./user.repository.interface";
import { User } from "@prisma/client";

@Injectable()
export class UserService {

    constructor(@Inject(USER_REPOSITORY) private readonly userRepository: UserRepositoryInterface){}

    async getUsers(): Promise<User[]> {
        return await this.userRepository.findAll();
    }
}