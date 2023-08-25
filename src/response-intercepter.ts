import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import {
  Observable,
  map,
} from "rxjs";

@Injectable()
export class ResponseIntercepter implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(map((data) => ({ data })));
  }
}
