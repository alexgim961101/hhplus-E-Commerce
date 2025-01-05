import { Inject, Injectable } from "@nestjs/common";
import { IUserRepository, USER_REPOSITORY } from "../../interface/repository/user.repository";
import { User } from "../../domain/user.domain";

@Injectable()
export class UserService {
    constructor(@Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository) {}

    async findAll(): Promise<User[]> {
        return await this.userRepository.findAll();
    }
}
