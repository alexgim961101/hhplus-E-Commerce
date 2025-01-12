import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
export const createTable = async (prisma: PrismaClient) => {
    const importSql = fs.readFileSync(path.join(__dirname, '../it/create-table.sql')).toString();
    for (const sql of importSql.split(";").filter((s) => s.trim() !== "")) {
        await prisma.$executeRawUnsafe(sql);
    }
}