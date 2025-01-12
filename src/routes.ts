import {
  RouterModule,
} from "@nestjs/core";
import {
  AuthModule,
} from "./auth/auth.module";
import {
  ArticleModule,
} from "./article/article.module";
import {
  MemberModule,
} from "./member/member.module";

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
            path: "members",
            module: MemberModule,
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
  MemberModule,
  ArticleModule,
];
