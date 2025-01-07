import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UserService } from "../domain/user.service";
import { CreateUserDto } from "./dto/create-user.dto";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async getUser(@Param('userId') userId: number) {
        return this.userService.getUser(userId);
    }

    @Post()
    async createUser(@Body() body: CreateUserDto) {
        return this.userService.createUser(body);
    }
}