import {
  Controller,
  Get,
} from "@nestjs/common";
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from "@nestjs/terminus";
import {
  InjectDataSource,
} from "@nestjs/typeorm";
import {
  DataSource,
} from "typeorm";
import {
  Public,
} from "src/auth/auth.guard";

@Controller()
export class HealthController {

  constructor(
    private readonly health: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    @InjectDataSource("writable")
    private readonly writableDataSource: DataSource,
    @InjectDataSource("readonly")
    private readonly readonlyDataSource: DataSource,
  ) { }

  @Public()
  @HealthCheck()
  @Get()
  check() {
    return this.health.check([
      () => this.db.pingCheck("writable", { connection: this.writableDataSource }),
      () => this.db.pingCheck("readonly", { connection: this.readonlyDataSource }),
    ]);
  }
}
