import { Module } from "@nestjs/common";
import { UserController } from "./interface/controller/user.controller";
import { UserService } from "./application/service/user.service";
import { UserPrismaRepository } from "./infrastructure/repository/user.prisma.repository";
import { USER_REPOSITORY } from "./interface/repository/user.repository";
import { PrismaConfig } from "../../prisma/config/prisma.config";

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    PrismaConfig,
    UserService,
    { provide: USER_REPOSITORY, useClass: UserPrismaRepository },
  ],
})
export class UserModule {}
