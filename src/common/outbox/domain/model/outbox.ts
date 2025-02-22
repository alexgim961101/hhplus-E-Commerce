export enum Status {
    QUEUED = 'queued',
    PROCESSED = 'processed',
    SKIPPED = 'skipped'
}

export class Outbox {
    id?: number;
    topic?: string;
    dbKey?: string;
    message?: string;
    status?: Status;
    updatedAt?: Date;
    createdAt?: Date;

    constructor(outbox: Partial<Outbox>) {
        this.id = outbox.id;
        this.topic = outbox.topic;
        this.dbKey = outbox.dbKey;
        this.message = outbox.message;
        this.status = outbox.status;
        this.updatedAt = outbox.updatedAt;
        this.createdAt = outbox.createdAt;
    }
}