import * as fs from "node:fs";
import * as path from "path";
import * as cookieParser from "cookie-parser";
import helmet from "helmet";
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
    const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../package.json"), "utf-8"));
    const swaggerConfig = new DocumentBuilder()
      .setTitle(pkg.name)
      .setDescription("API Document")
      .setVersion(pkg.version)
      .addBearerAuth()
      .addCookieAuth("refresh-token")
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("/api", app, documentFactory);
  }
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || !configService.get<boolean>("isProduction")) {
        return callback(null, true);
      }
      if (/^(https?:\/\/)?(([\w\d-\.]*)?\.)?narumir.io/.test(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    optionsSuccessStatus: 204,
    preflightContinue: false,
  });
  app
    .enableShutdownHooks()
    .use(cookieParser())
    .use(helmet())
    .useGlobalPipes(new ValidationPipe());
  await app.listen(port);
}

bootstrap();
