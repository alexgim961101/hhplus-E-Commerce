import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UserService } from "@/user/domain/user.service";
import { CreateUserDto } from "@/user/presentation/dto/create-user.dto";
import { GetUserRespDto } from "@/user/presentation/dto/getUser-resp.dto";
import { CreateUserRespDto } from "@/user/presentation/dto/createUser-resp.dto";
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";

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
        return GetUserRespDto.from(user);
    }


    @ApiOperation({ summary: '사용자 생성', description: '새로운 사용자를 생성합니다.' })
    @ApiBody({ type: CreateUserDto })
    @ApiResponse({ 
        status: 201, 
        description: '사용자 생성 성공',
        type: CreateUserRespDto 
    })
    @Post()
    async createUser(@Body() body: CreateUserDto): Promise<CreateUserRespDto> {
        const user = await this.userService.createUser(body);
        return CreateUserRespDto.from(user);
    }
}