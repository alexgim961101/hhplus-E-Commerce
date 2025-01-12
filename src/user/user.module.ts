import { Module } from "@nestjs/common";
import { UserController } from "@/user/presentation/controller/user.controller";
import { UserService } from "@/user/domain/service/user.service";
import { USER_REPOSITORY } from "@/user/domain/repository/user.repository.interface";
import { UserRepository } from "@/user/infra/repository/user.repository";
import { PrismaModule } from "@/prisma/prisma.module";
import { UserMapper } from "@/user/infra/mapper/user.mapper";

@Module({
    exports: [UserService],
    imports: [PrismaModule],
    controllers: [UserController],
    providers: [UserService, UserMapper, { provide: USER_REPOSITORY, useClass: UserRepository }],
})
export class UserModule {}
