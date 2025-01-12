import {
  Module,
} from '@nestjs/common';
import {
  Configure,
  DataSourse,
} from './configures';

@Module({
  imports: [
    Configure,
    DataSourse,
  ],
})
export class AppModule { }
