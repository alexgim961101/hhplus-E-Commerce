import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransactionManager } from '../domain/transaction.interface';

@Injectable()
export class PrismaTransactionManager implements TransactionManager {
    constructor(private readonly prisma: PrismaService) {}

    async runInTransaction<T>(
        callback: (transaction: any) => Promise<T>
    ): Promise<T> {
        return await this.prisma.$transaction(async (tx) => {
            return await callback(tx);
        });
    }
} 