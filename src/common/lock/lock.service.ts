import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { WinstonLogger } from "nest-winston";
import { RedisService } from "../redis/redis.service";
import { v4 as uuidv4 } from 'uuid';
import { InjectRedis } from "@songkeys/nestjs-redis";

@Injectable()
export class LockService {
    constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger, @InjectRedis() private readonly redisService: RedisService) {}

    async acquireLock(key: string, ttl: number): Promise<string> {
        const uniqueId = uuidv4();

        const lock = await this.redisService.acquireLock(key, uniqueId, ttl);

        if (!lock) {
            this.logger.warn(`Lock acquisition failed for key: ${key}`);
            return null;
        }

        this.logger.log(`Lock acquired for key: ${key} with uniqueId: ${uniqueId}`);

        return uniqueId;
    }

    async releaseLock(key: string, uniqueId: string): Promise<boolean> {
        const relased = await this.redisService.releaseLock(key, uniqueId);
    
        if (relased) {
            this.logger.log(`Lock released for key: ${key} with uniqueId: ${uniqueId}`);
            await this.redisService.publish(key, uniqueId);
            return true;
        }

        this.logger.warn(`Lock release failed for key: ${key} with uniqueId: ${uniqueId}`);
        return false;
    }

    async waitForLockRelease(key: string, timeout: number): Promise<void> {
        return new Promise((resolve, reject) => {
            const channel = `lock:${key}`;
            let isResolved = false;
      
            // 타임아웃 설정
            const timer = setTimeout(() => {
              if (!isResolved) {
                isResolved = true;
                this.redisService.unsubscribe(channel);
                reject(new Error(`Timeout waiting for lock release on key: ${key}`));
              }
            }, timeout);
      

            this.redisService.subscribe(channel, (message) => {
              if (message === 'released' && !isResolved) {
                isResolved = true;
                clearTimeout(timer);
                this.redisService.unsubscribe(channel);
                resolve();
              }
            });
        });
    }

    async acquireLockWithWait(key: string, ttl: number, timeout: number): Promise<string> {
        let lockValue = await this.acquireLock(key, ttl);
        if (lockValue) {
          return lockValue;
        }
    
        try {
          await this.waitForLockRelease(key, timeout);
          lockValue = await this.acquireLock(key, ttl);
          if (lockValue) {
            return lockValue;
          }
        } catch (error) {
          this.logger.error(`Error waiting for lock release: ${error.message}`);
        }
    
        throw new Error(`Failed to acquire lock for key: ${key}`);
      }
}
 