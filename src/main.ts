import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "@/app.module";
import * as fs from "fs";
import { ValidationPipe } from "@nestjs/common";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { LoggingInterceptor } from "./common/interceptor/logging.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  const config = new DocumentBuilder()
    .setTitle("E-Commerce API")
    .setDescription("E-Commerce API 명세서")
    .setVersion("1.0")
    .addTag("Point")
    .addTag("Coupon")
    .addTag("Product")
    .addTag("Payment")
    .addTag("Order")
    .build();

  const document = SwaggerModule.createDocument(app, config);

  fs.writeFileSync("./swagger-spec.json", JSON.stringify(document));

  SwaggerModule.setup("api", app, document);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));

  await app.listen(3000);
}
bootstrap();
