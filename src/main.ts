import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import {
  NestFactory,
} from '@nestjs/core';
import {
  ConfigService,
} from '@nestjs/config';
import {
  ValidationPipe,
} from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';
import {
  AppModule,
} from './app.module';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>("port");
  app
    .useGlobalPipes(new ValidationPipe())
    .use(cookieParser())
    .use(helmet())
    .enableCors({
      origin: (origin, callback) => {
        callback(null, true);
      },
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      credentials: true,
      optionsSuccessStatus: 204,
      preflightContinue: false,
    });
  if (process.env.NODE_ENV !== "production") {
    const swaggerConfig = new DocumentBuilder()
      .setTitle("blog api")
      .setDescription("The blog api")
      .setVersion("0.0.1")
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("api", app, document);
  }
  await app.listen(port);
};

bootstrap();
