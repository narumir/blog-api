import {
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import {
  Configure,
  DataSourse,
} from './configures';
import {
  LoggingModule,
} from './logging/logging.module';
import {
  RegisteredModules,
  Routes,
} from './routes';
import {
  LoggingMiddleware,
} from './logging/logging.middleware';

@Module({
  imports: [
    Configure,
    DataSourse,
    Routes,
    LoggingModule,
    ...RegisteredModules,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes("*")
  }
}
