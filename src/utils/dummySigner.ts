export class DummySigner {
  pk: string;
  pkh: string;
  constructor(pk: string, pkh: string) {
    this.pk = pk;
    this.pkh = pkh;
  }
  async publicKey() {
    return this.pk;
  }
  async publicKeyHash() {
    return this.pkh;
  }
}
