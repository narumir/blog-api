import {
  Module,
} from "@nestjs/common";
import {
  APP_FILTER,
  APP_INTERCEPTOR,
} from "@nestjs/core";
import {
  LoggingInterceptor,
} from "./logging.interceptor";
import {
  LoggingService,
} from "./logging.service";
import {
  LoggingFilter,
} from "./logging.filter";

@Module({
  providers: [
    LoggingService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: LoggingFilter,
    },
  ],
})
export class LoggingModule { }
