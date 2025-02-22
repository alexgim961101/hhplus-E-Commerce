import { Injectable } from "@nestjs/common";
import { OutBox, Status } from "@prisma/client";
import { Outbox } from "../../domain/model/outbox";
import { Status as DomainStatus } from "../../domain/model/outbox"; // Import your domain Status enum
import { Status as PrismaStatus } from "@prisma/client"; // Import Prisma Status enum


@Injectable()
export class OutboxMapper {
    toDomain(outbox: OutBox): Outbox {
        return new Outbox({
            id: Number(outbox.id),
            topic: outbox.topic,
            dbKey: outbox.dbKey,
            message: outbox.message,
            status: mapPrismaStatusToDomain(outbox.status)
        });
    }
}

function mapPrismaStatusToDomain(status: PrismaStatus): DomainStatus {
    switch (status) {
        case PrismaStatus.queued:
            return DomainStatus.QUEUED; // Ensure these match your domain enum values
        case PrismaStatus.processed:
            return DomainStatus.PROCESSED;
        case PrismaStatus.skipped:
            return DomainStatus.SKIPPED;
        // Add other cases as needed
        default:
            throw new Error(`Unknown status: ${status}`);
    }
}