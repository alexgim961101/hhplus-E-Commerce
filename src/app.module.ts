import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "./user/user.module";
import { PointModule } from "./point/point.moduel";

@Module({
  imports: [ConfigModule.forRoot(), UserModule, PointModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
