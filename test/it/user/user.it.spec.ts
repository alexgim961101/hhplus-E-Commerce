import { winstonConfig } from "@/common/logger/winston.config";
import { PrismaModule } from "@/prisma/prisma.module";
import { PrismaService } from "@/prisma/prisma.service";
import { UserService } from "@/user/domain/service/user.service";
import { CreateUserReqDto } from "@/user/presentation/dto/request/create-user-req.dto";
import { UserModule } from "@/user/user.module";
import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { WinstonModule } from "nest-winston";

describe('User 모듈 통합 테스트', () => {
    let userService: UserService
    let prisma: PrismaService
    let module: TestingModule

    beforeEach(async () => {
        module = await Test.createTestingModule({
            imports: [UserModule, PrismaModule, WinstonModule.forRoot(winstonConfig)]
        }).compile();

        userService = module.get<UserService>(UserService);
        prisma = module.get<PrismaService>(PrismaService);

        await prisma.user.deleteMany()
    })

    describe('User 생성 테스트', () => {
        it('일반적인 User 생성 테스트', async () => {
            // Given
            const mockUserData: CreateUserReqDto = new CreateUserReqDto()
            mockUserData.points = 1000

            // when
            const user = await userService.createUser(mockUserData)

            // then
            expect(user.id).toBeDefined()
            expect(user.points).toBe(mockUserData.points)
        });
    })

    describe('User 조회 테스트', () => {
        it('일반적인 User 조회 테스트', async () => {
            // given
            // User 생성
            const mockUserData: CreateUserReqDto = new CreateUserReqDto()
            mockUserData.points = 1000
            const createdUser = await userService.createUser(mockUserData)

            // when
            const getUser = await userService.getUser(createdUser.id)

            // then
            expect(getUser.id).toBe(createdUser.id)
            expect(getUser.points).toBe(createdUser.points)
        })

        it('존재하지 않는 userId로 조회 시 에러 발생', async () => {
            // given
            const invaildUserId = 1

            // when && then
            await expect(userService.getUser(invaildUserId)).rejects.toThrow(NotFoundException)
        })
    })
})