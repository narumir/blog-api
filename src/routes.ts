import {
  RouterModule,
} from "@nestjs/core";
import {
  AuthModule,
} from "./auth/auth.module";
import {
  ArticleModule,
} from "./article/article.module";

export const Routes = RouterModule.register([
  {
    path: "api",
    children: [
      {
        path: "v1",
        children: [
          {
            path: "auth",
            module: AuthModule,
          },
          {
            path: "articles",
            module: ArticleModule,
          },
        ],
      },
    ],
  },
]);

export const RegisteredModules = [
  AuthModule,
  ArticleModule,
];
