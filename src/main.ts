import {
  NestFactory,
} from '@nestjs/core';
import {
  NestExpressApplication,
} from '@nestjs/platform-express';
import {
  ConfigService,
} from '@nestjs/config';
import {
  ValidationPipe,
} from '@nestjs/common';
import {
  AppModule,
} from './app.module';
import {
  ResponseIntercepter,
} from './response-intercepter';

const bootstrap = async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app
    .useGlobalPipes(new ValidationPipe())
    .useGlobalInterceptors(new ResponseIntercepter());
  const configService = app.get(ConfigService);
  const port = configService.get<number>("port");
  await app.listen(port);
};

bootstrap();
