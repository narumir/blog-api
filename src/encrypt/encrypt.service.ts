import {
  KeyObject,
  RsaPrivateKey,
  RsaPublicKey,
  constants,
  createPrivateKey,
  createPublicKey,
  privateDecrypt,
  publicEncrypt,
} from "crypto";
import {
  Inject,
  Injectable,
} from "@nestjs/common";

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
