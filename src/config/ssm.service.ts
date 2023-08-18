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

  private async getParameters(...keys: string[]) {
    const env = this.envMode[process.env.NODE_ENV];
    const region = this.configService.get("region");
    const ssm = new SSM({
      region,
    });
    const initialValue: Record<string, string> = {};
    const names = keys.map((key) => `/blog/${env}/${key}`);
    if (names.length === 0) {
      return initialValue;
    }
    const {
      Parameters: parameters,
    } = await ssm.getParameters({
      Names: names,
      WithDecryption: true,
    });
    return parameters.reduce((p, { Name: name, Value: value }) => {
      const key = name.split("/").at(-1);
      p[key] = value;
      return p;
    }, initialValue);
  }

  getEncryptParameters() {
    return this.getParameters(
      "rsa_public_key",
      "rsa_private_key",
    );
  }

  getReadonlyDatabaseParameters() {
    return this.getParameters(
      "db_readonly_host",
      "db_readonly_port",
      "db_readonly_username",
      "db_readonly_password",
    );
  }

  getWritableDatabaseParameters() {
    return this.getParameters(
      "db_writable_host",
      "db_writable_port",
      "db_writable_username",
      "db_writable_password",
    );
  }

  getAuthParameters() {
    return this.getParameters(
      "jwt_expires_in",
      "jwt_private_key",
      "jwt_public_key",
    );
  }
}
