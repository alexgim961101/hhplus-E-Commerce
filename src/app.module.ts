import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import * as Joi from "joi";
import { PrismaModule } from "./prisma/prisma.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [ConfigModule.forRoot({ 
      isGlobal: true,
      validationSchema: Joi.object({
          ENV: Joi.string().valid('dev', 'prod').required(),
          DATABASE_URL: Joi.string().required(),
        }),
    }),
    PrismaModule,
    UserModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
