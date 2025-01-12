import {
  Module,
} from '@nestjs/common';
import {
  Configure,
  DataSourse,
} from './configures';
import {
  RegisteredModules,
  Routes,
} from './routes';

@Module({
  imports: [
    Configure,
    DataSourse,
    Routes,
    ...RegisteredModules,
  ],
})
export class AppModule { }
