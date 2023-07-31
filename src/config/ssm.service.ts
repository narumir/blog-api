import {
  Injectable,
} from "@nestjs/common";
import {
  ConfigService,
} from "@nestjs/config";
import {
  SSM,
} from "@aws-sdk/client-ssm";

@Injectable()
export class SSMService {
  private readonly envMode = {
    "production": "prod",
    "development": "dev",
    "local": "local",
    "test": "dev",
  }
  constructor(private readonly configService: ConfigService) { }

  async getParameters() {
    const env = this.envMode[process.env.NODE_ENV];
    const region = this.configService.get("region");
    const ssm = new SSM({
      region,
    });
    const {
      Parameters: parameters,
    } = await ssm.getParametersByPath({
      Path: `/blog/${env}`,
      WithDecryption: true,
    });
    const initialParams: Record<string, string> = {};
    return parameters.reduce((p, { Name: name, Value: value }) => {
      const key = name.split("/").at(-1);
      p[key] = value;
      return p;
    }, initialParams);
  }
}
