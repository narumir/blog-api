import {
  ExecutionContext,
  createParamDecorator,
} from "@nestjs/common";
import {
  Request,
} from "express";

export const Auth = createParamDecorator((context: ExecutionContext) => {
  const ctx = context.switchToHttp();
  const req = ctx.getRequest<Request>();
  return req["sub"];
});
