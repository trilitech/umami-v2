import { type Signer } from "@taquito/taquito";

/**
 * Is used to simulate operations without a risk
 * of accidentally signing them
 */
export class FakeSigner implements Signer {
  pk: string;
  pkh: string;

  constructor(pk: string, pkh: string) {
    this.pk = pk;
    this.pkh = pkh;
  }

  publicKey() {
    return Promise.resolve(this.pk);
  }

  publicKeyHash() {
    return Promise.resolve(this.pkh);
  }

  sign() {
    return Promise.reject(new Error("`sign` method not available"));
  }

  secretKey() {
    return Promise.reject(new Error("empty secret key"));
  }
}
