import { Module } from "@nestjs/common";
import { LockService } from "./lock.service";

@Module({
    imports: [],
    providers: [LockService],
    exports: [LockService]
})
export class LockModule {}