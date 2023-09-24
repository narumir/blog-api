import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from "@nestjs/common";
import {
  Observable,
  map,
} from "rxjs";

export class ResponseIntercepter implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    return next
      .handle()
      .pipe(map((data) => ({ data })));
  }
}
