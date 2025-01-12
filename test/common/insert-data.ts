import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
export const insertData = async (prisma: PrismaClient) => {
    const importSql = fs.readFileSync(path.join(__dirname, '../it/import.sql')).toString();
    for (const sql of importSql.split(";").filter((s) => s.trim() !== "")) {
        await prisma.$executeRawUnsafe(sql);
    }
}