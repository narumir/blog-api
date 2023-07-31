import {
  Module,
} from '@nestjs/common';
import {
  EnvConfig,
  SSMModule,
} from './config';

@Module({
  imports: [
    EnvConfig,
    SSMModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
