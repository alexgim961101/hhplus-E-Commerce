import { LockService } from './lock.service';

export function DistributedLock(key: string, ttl: number = 30000) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const lockService: LockService = (this as any).lockService;
      if (!lockService) {
        throw new Error('LockService not injected into the class');
      }

      let lockValue: string | null = null;
      try {
        lockValue = await lockService.acquireLock(key, ttl);
        if (!lockValue) {
          throw new Error('Failed to acquire lock');
        }
        return await originalMethod.apply(this, args);
      } finally {
        if (lockValue) {
          await lockService.releaseLock(key, lockValue);
        }
      }
    };

    return descriptor;
  };
}