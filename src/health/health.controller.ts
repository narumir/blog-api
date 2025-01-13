import {
  Controller,
  Get,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
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

@ApiTags("Health")
@Controller()
export class HealthController {

  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly db: TypeOrmHealthIndicator,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) { }

  @HealthCheck()
  @Get()
  public check() {
    return this.healthCheckService.check([
      () => this.db.pingCheck("database", { connection: this.dataSource }),
    ]);
  }
}
