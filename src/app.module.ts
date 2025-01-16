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
import { APP_INTERCEPTOR } from "@nestjs/core";
import { LoggingInterceptor } from "./common/interceptor/logging.interceptor";

@Module({
  imports: [ConfigModule.forRoot({ 
      isGlobal: true, 
      validationSchema: Joi.object({
          ENV: Joi.string().valid('dev', 'prod').required(),
          DATABASE_URL: Joi.string().required(),
        }),
    }),
    WinstonModule.forRoot(winstonConfig),
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
    }
  ],
})
export class AppModule {}
