import {
  NestFactory,
} from '@nestjs/core';
import {
  NestExpressApplication,
} from '@nestjs/platform-express';
import {
  AppModule,
} from './app.module';
import { ConfigService } from '@nestjs/config';

const bootstrap = async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>("port");
  await app.listen(port);
};

bootstrap();
