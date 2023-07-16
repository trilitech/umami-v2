import { Signer } from "@taquito/taquito";
import { PublicKeyPair } from "../restoreAccounts";
export class DummySigner implements Signer {
  pk: string;
  pkh: string;

  constructor({ pk, pkh }: PublicKeyPair) {
    this.pk = pk;
    this.pkh = pkh;
  }
  async publicKey() {
    return this.pk;
  }
  async publicKeyHash() {
    return this.pkh;
  }

  async sign(): Promise<{
    bytes: string;
    sig: string;
    prefixSig: string;
    sbytes: string;
  }> {
    throw new Error("`sign` method not available");
  }

  async secretKey(): Promise<string | undefined> {
    throw new Error("empty secret key");
  }
}
