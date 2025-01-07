import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UserRepositoryInterface } from "../domain/user.repository.interface";
import { User } from "@prisma/client";

@Injectable()
export class UserRepository implements UserRepositoryInterface {
    constructor(private readonly prisma: PrismaService) {}

    async findById(id: number): Promise<User | null> {
        return await this.prisma.user.findUnique({ where: { id } });
    }
    async findAll(): Promise<User[]> {
        return await this.prisma.user.findMany();
    }
    async create(user: User): Promise<User> {
        return await this.prisma.user.create({ data: user });
    }
    async update(user: User): Promise<User> {
        return await this.prisma.user.update({ where: { id: user.id }, data: user });
    }
    async delete(id: number): Promise<void> {
        await this.prisma.user.delete({ where: { id } });
    }
}   