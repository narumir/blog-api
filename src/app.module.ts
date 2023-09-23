import Configuration from "src/config/configuration";
import {
  ReadonlyDataSource,
  WritableDataSource,
} from "src/config/database";
import {
  Module,
} from '@nestjs/common';

@Module({
  imports: [
    Configuration,
    ReadonlyDataSource,
    WritableDataSource,
  ],
  providers: [
  ],
})
export class AppModule { }
