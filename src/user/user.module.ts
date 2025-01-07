import { Module } from "@nestjs/common";
import { UserController } from "./presentation/user.controller";
import { UserService } from "./domain/user.service";
import { USER_REPOSITORY } from "./domain/user.repository.interface";
import { UserRepository } from "./infra/user.repository";

@Module({
    imports: [],
    controllers: [UserController],
    providers: [UserService, { provide: USER_REPOSITORY, useClass: UserRepository }],
})
export class UserModule {}
