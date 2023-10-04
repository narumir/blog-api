import configuration from "src/config/configuration";
import {
  Test,
} from "@nestjs/testing";
import {
  createPublicKey,
} from "crypto";
import {
  ReadonlyDataSource,
  WritableDataSource,
} from "src/config/database";
import {
  EncryptController,
} from "./encrypt.controller";
import {
  EncryptKeyProvider,
  EncryptService,
} from "./encrypt.service";

describe("Encrypt module", () => {
  let encryptController: EncryptController;
  let encryptService: EncryptService;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        configuration,
        ReadonlyDataSource,
        WritableDataSource,
      ],
      controllers: [
        EncryptController,
      ],
      providers: [
        EncryptService,
        EncryptKeyProvider,
      ],
    })
      .compile();
    encryptController = moduleRef.get<EncryptController>(EncryptController);
    encryptService = moduleRef.get<EncryptService>(EncryptService);
  });
  it("encrypt and decrypt text", async () => {
    const origin = "hello world";
    const publicKey = encryptService.getPublicKey().replace(/\n/, "\n");
    const encrypt = encryptService.encode(origin, createPublicKey(publicKey));
    const decrypt = encryptService.decode(encrypt);
    expect(decrypt).toEqual(origin);
  });
});
