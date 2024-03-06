import { accountsMigrations, mainStoreMigrations } from "./migrations";
import { mockImplicitAddress, mockSecretKeyAccount } from "../../mocks/factories";

describe("migrations", () => {
  describe("main", () => {
    test("0", () => {
      expect(mainStoreMigrations[0]({ multisigs: {} })).toEqual({ multisigs: { labelsMap: {} } });
    });

    test("1", () => {
      expect(mainStoreMigrations[1]({})).toEqual({
        announcement: {
          html: "",
          seen: true,
        },
      });
    });

    test("3", () => {
      expect(
        mainStoreMigrations[3]({
          beacon: {
            someDAppId: { accountPkh: mockImplicitAddress(0).pkh, networkType: "mainnet" },
            otherDAppId: { accountPkh: mockImplicitAddress(1).pkh, networkType: "ghostnet" },
          },
        })
      ).toEqual({
        beacon: {
          someDAppId: { [mockImplicitAddress(0).pkh]: "mainnet" },
          otherDAppId: { [mockImplicitAddress(1).pkh]: "ghostnet" },
        },
      });
    });
  });

  describe("accounts", () => {
    test("2", () => {
      expect(
        accountsMigrations[2]({ items: [{ ...mockSecretKeyAccount(0), curve: undefined }] })
      ).toEqual({
        items: [
          {
            ...mockSecretKeyAccount(0),
            curve: "ed25519",
          },
        ],
      });
    });
  });
});
