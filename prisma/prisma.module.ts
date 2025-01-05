import { Module } from "@nestjs/common";
import { PrismaConfig } from "./config/prisma.config";

@Module({
    imports: [],
    providers: [PrismaConfig],
    exports: [PrismaConfig],
})
export class PrismaModule {}
