import { mnemonic1 } from "@umami/test-utils";
import { encrypt, decryptV1 } from "./index";

const v1Data = {
  cipher:
    "GhDQ61mwh3zUGPAqV+aFab2N7QPs8LixKY8D1gj+qOpNijkxC32/v/pJOkBrCLhh76EBklCMPJsm+3m4pmOfMdxlxsdZs99sCNnq/aHHN5D4DwmwNwUgo5vKaYiOlKZQKNY91Pd6/zj4M75tDecmWL3r0XZyxpMbvqRCl8w7Utx1YWWT/1jRpqqoKZM+9Zx5NMWn3D/js6paz2h0AnRCoQ==",
  iv: "d99db23bc2b8032aefcf376edc9671ac",
};

describe("encrypt", () => {
  // TODO
  it("works", () => {
    expect(encrypt("data", "password")).toEqual("encrypted data");
  });

  it("can decrypt v1 data", () => {
    expect(decryptV1(v1Data, "Password123$")).toEqual(mnemonic1);
  });
});
