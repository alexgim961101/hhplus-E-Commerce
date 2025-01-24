import { Injectable } from "@nestjs/common";
import { InjectRedis } from '@songkeys/nestjs-redis';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
    constructor(@InjectRedis() private readonly redis: Redis) {}

    getClient() {
        return this.redis;
    }

    async acquireLock(key: string, value: string, ttl: number): Promise<boolean> {
        const lock = await this.redis.set(key, value, 'EX', ttl, 'NX');  // ttl은 초 단위
        return lock === 'OK';
    }

    async releaseLock(key: string, value: string): Promise<boolean> {
        // Lua Script
        // key값을 이용해 값을 가져온 후 그 값이 value와 같으면 key를 삭제하고 1을 반환, 아니면 0을 반환
        const script = `
            if redis.call("get", KEYS[1]) == ARGV[1]
            then
                return redis.call("del", KEYS[1])
            else
                return 0
            end
        `

        const result = await this.redis.eval(script, '1', key, value);
        return result === 1;
    }

    async subscribe(channel: string, callback: (message: string) => void) {
        await this.redis.subscribe(channel);
        this.redis.on('message', (ch, message) => {
            if (ch === channel) {
                callback(message);
            }
        });
    }

    async unsubscribe(channel: string): Promise<void> {
        await this.redis.unsubscribe(channel);
    }

    async publish(channel: string, message: string): Promise<number> {
        return this.redis.publish(channel, message);
    }
}