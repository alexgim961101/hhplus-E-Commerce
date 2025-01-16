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
import winston from "winston";
import { winstonConfig } from "./logger/winston.config";

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
  providers: [],
})
export class AppModule {}
