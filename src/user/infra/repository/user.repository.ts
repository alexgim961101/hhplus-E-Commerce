import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service";
import { UserRepositoryInterface } from "@/user/domain/repository/user.repository.interface";
import { UserMapper } from "@/user/infra/mapper/user.mapper";
import { UserModel } from "@/user/domain/model/user.model";
import { User } from "@prisma/client";

@Injectable()
export class UserRepository implements UserRepositoryInterface {
    constructor(private readonly prisma: PrismaService, private readonly userMapper: UserMapper) {}

    async findById(id: number, tx?: any): Promise<UserModel | null> {
        const prisma = tx || this.prisma;
        try {
            const user = await prisma.user.findUnique({ where: { id } });
            return this.userMapper.toDomain(user);
        } catch (error) {
            throw new NotFoundException(`User with id ${id} not found`);
        }
    }
    async findByIdWithLock(id: number, tx?: any): Promise<UserModel | null> {
        const prisma = tx || this.prisma;
        const [result] = await prisma.$queryRaw<User>`
            SELECT id, points, createdAt, updatedAt 
            FROM \`User\` 
            WHERE id = ${id} 
            FOR UPDATE
        `;
        return this.userMapper.toDomain(result) || null;
    }
    async findAll(): Promise<UserModel[]> {
        const users = await this.prisma.user.findMany();
        return this.userMapper.toDomainList(users);
    }
    async create(userModel: UserModel): Promise<UserModel> {
        const user = await this.prisma.user.create({ data: userModel });
        return this.userMapper.toDomain(user);
    }
    async update(userModel: UserModel, tx?: any): Promise<UserModel> {
        const prisma = tx || this.prisma;
        const user = await prisma.user.update({
            where: { id: userModel.id },
            data: userModel
        });
        return this.userMapper.toDomain(user);
    }
    async delete(id: number): Promise<UserModel> {
        const user = await this.prisma.user.delete({ where: { id } });
        return this.userMapper.toDomain(user);
    }
}   