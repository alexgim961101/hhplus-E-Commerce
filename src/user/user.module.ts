import { Module } from "@nestjs/common";
import { UserController } from "./presentation/user.controller";
import { UserService } from "./domain/user.service";
import { USER_REPOSITORY } from "./domain/user.repository.interface";
import { UserRepository } from "./infra/user.repository";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
    exports: [UserService],
    imports: [PrismaModule],
    controllers: [UserController],
    providers: [UserService, { provide: USER_REPOSITORY, useClass: UserRepository }],
})
export class UserModule {}
