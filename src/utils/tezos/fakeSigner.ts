import { Signer } from "@taquito/taquito";
export class FakeSigner implements Signer {
  pk: string;
  pkh: string;

  constructor(pk: string, pkh: string) {
    this.pk = pk;
    this.pkh = pkh;
  }
  async publicKey() {
    return Promise.resolve(this.pk);
  }
  async publicKeyHash() {
    return Promise.resolve(this.pkh);
  }

  async sign(): Promise<{
    bytes: string;
    sig: string;
    prefixSig: string;
    sbytes: string;
  }> {
    return Promise.reject(new Error("`sign` method not available"));
  }

  async secretKey(): Promise<string | undefined> {
    return Promise.reject(new Error("empty secret key"));
  }
}
