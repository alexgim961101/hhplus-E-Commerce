import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UserRepositoryInterface } from "../domain/user.repository.interface";
import { User } from "@prisma/client";
import { CreateUserDto } from "../domain/dto/create-user.dto";
import { UpdateUserDto } from "../domain/dto/update-user.dto";

@Injectable()
export class UserRepository implements UserRepositoryInterface {
    constructor(private readonly prisma: PrismaService) {}

    async findById(id: number): Promise<User | null> {
        return await this.prisma.user.findUnique({ where: { id } });
    }
    async findAll(): Promise<User[]> {
        return await this.prisma.user.findMany();
    }
    async create(createUserDto: CreateUserDto): Promise<User> {
        return await this.prisma.user.create({ data: createUserDto });
    }
    async update(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
        return await this.prisma.user.update({
            where: { id: userId },
            data: {
                points: updateUserDto.points
            }
        });
    }
    async delete(id: number): Promise<void> {
        await this.prisma.user.delete({ where: { id } });
    }
}   