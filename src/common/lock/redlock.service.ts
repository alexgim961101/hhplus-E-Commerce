import { Injectable } from "@nestjs/common";
import { InjectRedis } from '@songkeys/nestjs-redis';
import { Redis } from "ioredis";
import Redlock from "redlock";
import { Lock } from "redlock";

@Injectable()
export class RedlockService {
    private readonly redlock: Redlock;

    constructor(@InjectRedis() private readonly redis: Redis) {
        this.redlock = new Redlock(
            [this.redis],
            {
                driftFactor: 0.01,
                retryCount: 10,
                retryDelay: 200,
                retryJitter: 200,
              }
        );
    }

    async acquireLock(key: string, ttl: number): Promise<Lock> {
        return await this.redlock.acquire([key], ttl);
    }

    async releaseLock(lock: Lock): Promise<void> {
        await this.redlock.release(lock);
    }
}