import {
  Inject,
  Injectable,
  Provider,
} from "@nestjs/common";
import {
  ConfigService,
} from "@nestjs/config";
import {
  KeyObject,
  constants,
  RsaPrivateKey,
  RsaPublicKey,
  createPrivateKey,
  createPublicKey,
  privateDecrypt,
  publicEncrypt,
} from "crypto";

@Injectable()
export class EncryptService {
  private readonly privateKey: KeyObject;
  private readonly publicKey: KeyObject;

  constructor(
    @Inject("KEY_PROVIDER")
    private readonly keys: { publicKey: string, privateKey: string },
  ) {
    this.privateKey = createPrivateKey(keys.privateKey);
    this.publicKey = createPublicKey(keys.publicKey);
  }

  getPublicKey() {
    return this.keys.publicKey;
  }

  encode(data: string, publicKey: KeyObject = this.publicKey) {
    const buffer = Buffer.from(data);
    const key: RsaPublicKey = {
      key: publicKey,
      padding: constants.RSA_PKCS1_PADDING,
    };
    return publicEncrypt(key, buffer).toString("base64");
  }

  decode(data: string, privateKey: KeyObject = this.privateKey) {
    const buffer = Buffer.from(data, "base64");
    const key: RsaPrivateKey = {
      key: privateKey,
      passphrase: "",
      padding: constants.RSA_PKCS1_PADDING,
    };
    return privateDecrypt(key, buffer).toString("utf-8");
  }
}

export const EncryptKeyProvider: Provider = {
  provide: "KEY_PROVIDER",
  inject: [
    ConfigService,
  ],
  useFactory: async (configService: ConfigService) => {
    return {
      publicKey: configService.get("encrypt.publicKey").replace(/\\n/g, '\n'),
      privateKey: configService.get("encrypt.privateKey").replace(/\\n/g, '\n'),
    };
  },
};
