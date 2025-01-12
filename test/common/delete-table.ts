import { PrismaClient } from "@prisma/client";

export const deleteTable = async (prisma: PrismaClient) => {
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS OrderDetail');
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS Orders');
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS CouponHistory');
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS Coupon');
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS Product');
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS User');
    await prisma.$executeRawUnsafe('DROP TABLE IF EXISTS OrderProduct');
}