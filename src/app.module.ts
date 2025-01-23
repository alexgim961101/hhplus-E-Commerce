import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import * as Joi from "joi";
import { PrismaModule } from "@/prisma/prisma.module";
import { UserModule } from "@/user/user.module";
import { PointModule } from "@/point/point.module";
import { ProductModule } from "@/product/product.module";
import { CouponModule } from "@/coupon/coupon.module";
import { OrderModule } from "@/order/order.module";
import { WinstonModule } from "nest-winston";
import { winstonConfig } from "./common/logger/winston.config";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { LoggingInterceptor } from "./common/interceptor/logging.interceptor";
import { GlobalExceptionFilter } from "./common/filter/global-exception.filter";
import { LockModule } from "./common/lock/lock.module";
import { RedisModule } from "@songkeys/nestjs-redis";

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true, 
      validationSchema: Joi.object({
          ENV: Joi.string().valid('dev', 'prod').required(),
          DATABASE_URL: Joi.string().required(),
        }),
    }),
    RedisModule.forRoot({
      config: {
          host: 'localhost',
          port: 6379
      }
    }),
    WinstonModule.forRoot(winstonConfig),
    LockModule,
    PrismaModule,
    UserModule,
    PointModule,
    ProductModule,
    CouponModule,
    OrderModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter
    }
  ],
})
export class AppModule {}
