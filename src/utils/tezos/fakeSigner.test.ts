import { mockPk, mockImplicitAddress } from "../../mocks/factories";
import { FakeSigner } from "./fakeSigner";

describe("fakeSigner", () => {
  test("fakeSigner sets pk and pkh", async () => {
    const signer = new FakeSigner(mockPk(0), mockImplicitAddress(0).pkh);
    expect(await signer.publicKeyHash()).toEqual(mockImplicitAddress(0).pkh);
    expect(signer.pk).toEqual(mockPk(0));
  });

  test("sign method throws error", async () => {
    const signer = new FakeSigner(mockPk(0), mockImplicitAddress(0).pkh);
    await expect(signer.sign()).rejects.toThrowError("`sign` method not available");
  });

  test("secretKey method throws error", async () => {
    const signer = new FakeSigner(mockPk(0), mockImplicitAddress(0).pkh);
    await expect(signer.secretKey()).rejects.toThrowError("empty secret key");
  });
});
