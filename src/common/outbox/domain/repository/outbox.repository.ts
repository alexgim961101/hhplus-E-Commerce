import { Outbox, Status } from "../model/outbox";

export const OUTBOX_REPOSITORY = Symbol('OUTBOX_REPOSITORY');

export interface OutboxRepository {
    save(outbox: Outbox, tx?: any): Promise<Outbox>;
    update(outbox: Outbox, tx?: any): Promise<Outbox>;
    findByStatus(status: string, tx?: any): Promise<Outbox[]>;
}