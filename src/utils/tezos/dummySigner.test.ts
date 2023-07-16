import { mockPk, mockImplicitAddress } from "../../mocks/factories";
import { DummySigner } from "./dummySigner";

describe("dummySigner", () => {
  const dummySinger = new DummySigner({
    pk: mockPk(0),
    pkh: mockImplicitAddress(0).pkh,
  });
  test("dummySigner sets pk and pkh", async () => {
    expect(await dummySinger.publicKeyHash()).toEqual(mockImplicitAddress(0).pkh);
    expect(dummySinger.pk).toEqual(mockPk(0));
  });

  test("sign method throws error", async () => {
    await expect(dummySinger.sign()).rejects.toThrowError("`sign` method not available");
  });

  test("secretKey method throws error", async () => {
    await expect(dummySinger.secretKey()).rejects.toThrowError("empty secret key");
  });
});
