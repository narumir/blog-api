import {
  Module,
} from '@nestjs/common';
import {
  EnvConfig,
} from './config';

@Module({
  imports: [
    EnvConfig,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
