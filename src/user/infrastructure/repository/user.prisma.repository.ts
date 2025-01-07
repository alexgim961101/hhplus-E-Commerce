import { Injectable } from "@nestjs/common";
import { IUserRepository } from "../../interface/repository/user.repository";
import { PrismaConfig } from "prisma/config/prisma.config";
import { User } from "../../domain/user.domain";
import { UserMapper } from "../../interface/mapper/user.mapper";

@Injectable()
export class UserPrismaRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaConfig) {}

  findAll(): Promise<User[]> {
    return this.prisma.user
      .findMany()
      .then((users) => users.map(UserMapper.toDomain));
  }
}
