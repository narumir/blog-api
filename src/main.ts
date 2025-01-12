import * as pkg from "../package.json";
import {
  NestFactory,
} from "@nestjs/core";
import {
  ConfigService,
} from "@nestjs/config";
import {
  DocumentBuilder,
  SwaggerModule,
} from "@nestjs/swagger";
import {
  ValidationPipe,
} from "@nestjs/common";
import {
  AppModule,
} from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>("port");
  const isProduction = configService.getOrThrow<boolean>("isProduction");
  if (!isProduction) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle(pkg.name)
      .setDescription("API Document")
      .setVersion(pkg.version)
      .addBearerAuth()
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("/api", app, documentFactory);
  }
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);
}

bootstrap();
