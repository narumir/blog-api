import {
  Module,
} from "@nestjs/common";
import {
  ConfigService,
} from "@nestjs/config";
import {
  SSMService,
} from "./ssm.service";

@Module({
  providers: [
    ConfigService,
    SSMService,
  ],
  exports: [
    SSMService,
  ],
})
export class SSMModule { }
