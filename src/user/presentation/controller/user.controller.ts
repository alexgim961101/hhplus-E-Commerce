import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UserService } from "@/user/domain/service/user.service";
import { CreateUserRespDto } from "@/user/domain/dto/response/create-user-resp.dto";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateUserReqDto } from "@/user/domain/dto/request/create-user-req.dto";
import { GetUserRespDto } from "@/user/domain/dto/response/get-user-resp.dto";

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({ summary: '사용자 조회', description: '특정 사용자의 정보를 조회합니다.' })
    @ApiParam({ name: 'userId', description: '사용자 ID' })
    @ApiResponse({ 
        status: 200, 
        description: '사용자 정보 조회 성공',
        type: GetUserRespDto 
    })
    @ApiResponse({ status: 404, description: '사용자를 찾을 수 없음' })
    @Get(':userId')
    async getUser(@Param('userId') userId: number): Promise<GetUserRespDto> {
        const user = await this.userService.getUser(userId);
        return GetUserRespDto.fromDomain(user);
    }


    @ApiOperation({ summary: '사용자 생성', description: '새로운 사용자를 생성합니다.' })
    @ApiBody({ type: CreateUserReqDto })
    @ApiResponse({ 
        status: 201, 
        description: '사용자 생성 성공',
        type: CreateUserRespDto 
    })
    @Post()
    async createUser(@Body() body: CreateUserReqDto): Promise<CreateUserRespDto> {
        const user = await this.userService.createUser(body);
        return CreateUserRespDto.fromDomain(user);
    }
}