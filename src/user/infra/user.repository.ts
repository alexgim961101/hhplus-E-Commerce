import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { UserRepositoryInterface } from "../domain/user.repository.interface";
import { User } from "@prisma/client";
import { CreateUserDto } from "../domain/dto/create-user.dto";
import { UpdateUserDto } from "../domain/dto/update-user.dto";

@Injectable()
export class UserRepository implements UserRepositoryInterface {
    constructor(private readonly prisma: PrismaService) {}

    async findById(id: number, tx?: any): Promise<User | null> {
        const prisma = tx || this.prisma;
        return await prisma.user.findUnique({ where: { id } });
    }
    async findByIdWithLock(id: number, tx?: any): Promise<User | null> {
        const prisma = tx || this.prisma;
        const [result] = await prisma.$queryRaw<User>`
            SELECT id, points, createdAt, updatedAt 
            FROM \`User\` 
            WHERE id = ${id} 
            FOR UPDATE
        `;
        return result || null;
    }
    async findAll(): Promise<User[]> {
        return await this.prisma.user.findMany();
    }
    async create(createUserDto: CreateUserDto): Promise<User> {
        return await this.prisma.user.create({ data: createUserDto });
    }
    async update(userId: number, updateUserDto: UpdateUserDto, tx?: any): Promise<User> {
        const prisma = tx || this.prisma;
        return await prisma.user.update({
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