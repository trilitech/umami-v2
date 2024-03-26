import { accountsMigrations, mainStoreMigrations } from "./migrations";
import {
  mockContractAddress,
  mockImplicitAddress,
  mockSecretKeyAccount,
} from "../../mocks/factories";

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

    // TODO: add test 3

    test("4", () => {
      const implicitPkh = mockImplicitAddress(0).pkh;
      const mainnetPkh = mockContractAddress(0).pkh;
      const ghostnetPkh = mockContractAddress(1).pkh;
      const absentPkh = mockContractAddress(2).pkh;
      expect(
        mainStoreMigrations[4]({
          contacts: {
            implicitPkh: { name: "Implicit Contact", pkh: implicitPkh },
            mainnetPkh: { name: "Mainnet Contact", pkh: mainnetPkh },
            ghostnetPkh: { name: "Ghostnet Contact", pkh: ghostnetPkh },
            absentPkh: { name: "Absent Contact", pkh: absentPkh },
          },
        })
      ).toEqual({
        contacts: {
          implicitPkh: { name: "Implicit Contact", pkh: implicitPkh, network: undefined },
          mainnetPkh: { name: "Mainnet Contact", pkh: mainnetPkh, network: "mainnet" },
          ghostnetPkh: { name: "Ghostnet Contact", pkh: ghostnetPkh, network: "ghostnet" },
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
