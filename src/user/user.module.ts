import { Module } from "@nestjs/common";
import { UserController } from "@/user/presentation/controller/user.controller";
import { UserService } from "@/user/domain/user.service";
import { USER_REPOSITORY } from "@/user/domain/user.repository.interface";
import { UserRepository } from "@/user/infra/user.repository";
import { PrismaModule } from "@/prisma/prisma.module";

@Module({
    exports: [UserService],
    imports: [PrismaModule],
    controllers: [UserController],
    providers: [UserService, { provide: USER_REPOSITORY, useClass: UserRepository }],
})
export class UserModule {}
