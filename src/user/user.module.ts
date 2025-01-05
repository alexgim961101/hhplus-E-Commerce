import { Module } from "@nestjs/common";
import { UserController } from "./interface/controller/user.controller";
import { UserService } from "./application/service/user.service";
import { UserPrismaRepository } from "./infrastructure/repository/user.prisma.repository";
import { USER_REPOSITORY } from "./interface/repository/user.repository";
import { PrismaModule } from "prisma/prisma.module";

@Module({
    imports: [PrismaModule],
    controllers: [UserController],
    providers: [UserService, { provide: USER_REPOSITORY, useClass: UserPrismaRepository }],
})
export class UserModule {}