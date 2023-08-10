import {
  KeyObject,
  RsaPrivateKey,
  constants,
  createPrivateKey,
  privateDecrypt,
} from "crypto";
import {
  Inject,
  Injectable,
} from "@nestjs/common";

@Injectable()
export class EncryptService {
  private readonly privateKey: KeyObject;

  constructor(
    @Inject("KEY_PROVIDER")
    private readonly keys: { publicKey: string, privateKey: string },
  ) {
    this.privateKey = createPrivateKey(keys.privateKey);
  }

  getPublicKey() {
    return this.keys.publicKey;
  }

  decode(data: string) {
    const buffer = Buffer.from(data, "base64");
    const privateKey: RsaPrivateKey = {
      key: this.privateKey,
      passphrase: "",
      padding: constants.RSA_PKCS1_PADDING,
    };
    return privateDecrypt(privateKey, buffer).toString("utf-8");
  }
}
