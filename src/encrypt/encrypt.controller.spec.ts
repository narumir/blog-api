import {
  Test,
} from "@nestjs/testing";
import {
  createPublicKey,
} from "crypto";
import {
  AuthModule,
} from "src/auth/auth.module";
import {
  EnvConfig,
  ReadonlyDatabase,
  WritableDatabase,
} from "src/config";
import {
  EncryptController,
} from "./encrypt.controller";
import {
  EncryptService,
} from "./encrypt.service";
import {
  KeyProvider,
} from "./encrypt.module";

describe("Encrypt module", () => {
  let encryptController: EncryptController;
  let encryptService: EncryptService;
  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        EnvConfig,
        ReadonlyDatabase,
        WritableDatabase,
        AuthModule,
      ],
      controllers: [
        EncryptController,
      ],
      providers: [
        KeyProvider,
        EncryptService,
      ],
    })
      .compile();
    encryptController = moduleRef.get<EncryptController>(EncryptController);
    encryptService = moduleRef.get<EncryptService>(EncryptService);
  });
  describe("Encrypt controller", () => {
    it("GET /encrypt/public-key", async () => {
      const origin = "hello world";
      const { publicKey } = encryptController.getPublicKey();
      const key = publicKey.replace(/\\n/g, '\n');
      const encrypt = encryptService.encode(origin, createPublicKey(key));
      const decoded = encryptService.decode(encrypt);
      expect(decoded).toEqual(origin);
    });
  });
});
