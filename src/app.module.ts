import {
  Module,
} from '@nestjs/common';
import {
  EnvConfig,
  ReadonlyDatabase,
  SSMModule,
  WritableDatabase,
} from './config';

@Module({
  imports: [
    EnvConfig,
    SSMModule,
    ReadonlyDatabase,
    WritableDatabase,
  ],
})
export class AppModule { }
