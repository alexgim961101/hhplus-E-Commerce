export interface TransactionManager {
    runInTransaction<T>(
        callback: (transaction: unknown) => Promise<T>
    ): Promise<T>;
}

export const TRANSACTION_MANAGER = Symbol('TRANSACTION_MANAGER'); 