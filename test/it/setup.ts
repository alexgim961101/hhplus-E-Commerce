import * as fs from "fs";
import { MySqlContainer } from "@testcontainers/mysql";
import { PrismaClient } from "@prisma/client";
import { RedisContainer } from "@testcontainers/redis";
const init = async () => {
  await Promise.all([initMysql(), initRedis()]);
};

const initRedis = async () => {
  const redis = await new RedisContainer("redis:alpine")
    .withExposedPorts(6379)
    .withName("test-redis")
    .start();

  global.redis = redis;
}

const initMysql = async () => {
  const mysql = await new MySqlContainer("mysql:8")
    .withDatabase("e-commerce")
    .withUser("root")
    .withRootPassword("root")
    .start();

  global.mysql = mysql;

  process.env.DATABASE_URL = `mysql://${mysql.getUsername()}:${mysql.getUserPassword()}@${mysql.getHost()}:${mysql.getPort()}/e-commerce`;

  const prisma = new PrismaClient();
  await prisma.$connect();
  await createTable(prisma);
  await insertTestData(prisma);
};

const createTable = async (prisma: PrismaClient) => {
  const importSql = fs.readFileSync("./test/it/create-table.sql").toString();
  for (const sql of importSql.split(";").filter((s) => s.trim() !== "")) {
    await prisma.$executeRawUnsafe(sql);
  }
};

const insertTestData = async (prisma: PrismaClient) => {
  const importSql = fs.readFileSync("./test/it/import.sql").toString();
  for (const sql of importSql.split(";").filter((s) => s.trim() !== "")) {
    await prisma.$executeRawUnsafe(sql);
  }
};

export default init;
