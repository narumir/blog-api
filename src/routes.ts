import {
  RouterModule,
} from "@nestjs/core";
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
            path: "articles",
            module: ArticleModule,
          },
        ],
      },
    ],
  },
]);

export const RegisteredModules = [
  ArticleModule,
];
