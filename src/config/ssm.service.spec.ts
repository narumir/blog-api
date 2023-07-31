import {
  Test,
} from "@nestjs/testing";
import {
  ConfigService,
} from "@nestjs/config";
import {
  SSMService,
} from "./ssm.service";

describe("Get Parameters from SSM", () => {
  let service: SSMService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ConfigService,
        SSMService,
      ],
    })
      .compile();
    service = await module.get(SSMService);
  });
  it("get parameters from aws ssm", async () => {
    const parameters = await service.getParameters();
    expect(parameters).not.toBeFalsy();
  });
});
