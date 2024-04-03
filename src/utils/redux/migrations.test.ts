import { accountsMigrations, mainStoreMigrations } from "./migrations";
import {
  mockContractAddress,
  mockImplicitAddress,
  mockLedgerAccount,
  mockMnemonicAccount,
  mockSecretKeyAccount,
} from "../../mocks/factories";
import { waitFor } from "../../mocks/testUtils";
import { GHOSTNET, MAINNET } from "../../types/Network";
import * as helpers from "../multisig/helpers";

describe("migrations", () => {
  describe("main migrations", () => {
    it("0", () => {
      expect(mainStoreMigrations[0]({ multisigs: {} })).toEqual({ multisigs: { labelsMap: {} } });
    });

    it("1", () => {
      expect(mainStoreMigrations[1]({})).toEqual({
        announcement: {
          html: "",
          seen: true,
        },
      });
    });

    // TODO: add test 3

    test("5", () => {
      expect(
        mainStoreMigrations[5]({
          assets: { transfers: { tez: "something" } },
        })
      ).toEqual({ assets: { transfers: {} } });
    });

    it("6", async () => {
      const implicitPkh = mockImplicitAddress(0).pkh;
      const mainnetPkh = mockContractAddress(0).pkh;
      const ghostnetPkh = mockContractAddress(1).pkh;
      const absentPkh = mockContractAddress(2).pkh;

      const mockedGetNetworksForContracts = jest.spyOn(helpers, "getNetworksForContracts");
      mockedGetNetworksForContracts.mockResolvedValue(
        new Map([
          [mainnetPkh, "mainnet"],
          [ghostnetPkh, "ghostnet"],
        ])
      );

      const migratedStore = mainStoreMigrations[5]({
        networks: {
          current: [GHOSTNET],
          available: [[MAINNET, GHOSTNET]],
        },
        contacts: {
          implicitPkh: { name: "Implicit Contact", pkh: implicitPkh },
          mainnetPkh: { name: "Mainnet Contact", pkh: mainnetPkh },
          ghostnetPkh: { name: "Ghostnet Contact", pkh: ghostnetPkh },
          absentPkh: { name: "Absent Contact", pkh: absentPkh },
        },
      });

      expect(mockedGetNetworksForContracts).toHaveBeenCalledTimes(1);
      expect(mockedGetNetworksForContracts).toHaveBeenCalledWith([
        mainnetPkh,
        ghostnetPkh,
        absentPkh,
      ]);
      await waitFor(() =>
        expect(migratedStore).toEqual({
          networks: {
            current: [GHOSTNET],
            available: [[MAINNET, GHOSTNET]],
          },
          contacts: {
            implicitPkh: { name: "Implicit Contact", pkh: implicitPkh, network: undefined },
            mainnetPkh: { name: "Mainnet Contact", pkh: mainnetPkh, network: "mainnet" },
            ghostnetPkh: { name: "Ghostnet Contact", pkh: ghostnetPkh, network: "ghostnet" },
          },
        })
      );
    });
  });

  describe("account migrations", () => {
    it("2", () => {
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

    it("4", () => {
      const ledgerAcc = { ...mockLedgerAccount(0), derivationPathTemplate: undefined };
      const ledgerAccWithLongPath = {
        ...mockLedgerAccount(1),
        derivationPath: "44'/1729'/0'/0'/0'",
        derivationPathTemplate: undefined,
      };
      const ledgerAccWithDerivationTemplate = {
        ...mockLedgerAccount(2),
        derivationPathTemplate: "44'/1729'/0'/?'/0'",
      };
      const ledgerAccWithCustomDerivationPath = {
        ...mockLedgerAccount(3),
        derivationPath: "44'/1729'/0'/123'",
        derivationPathTemplate: undefined,
      };
      const nonLedgerAcc = mockMnemonicAccount(4);
      expect(
        accountsMigrations[4]({
          items: [
            ledgerAcc,
            ledgerAccWithLongPath,
            ledgerAccWithDerivationTemplate,
            ledgerAccWithCustomDerivationPath,
            nonLedgerAcc,
          ],
        })
      ).toEqual({
        items: [
          {
            ...ledgerAcc,
            derivationPathTemplate: "44'/1729'/?'/0'",
          },
          {
            ...ledgerAccWithLongPath,
            derivationPathTemplate: "44'/1729'/?'/0'/0'",
          },
          ledgerAccWithDerivationTemplate,
          {
            ...ledgerAccWithCustomDerivationPath,
            derivationPathTemplate: undefined, // cannot guess
          },
          nonLedgerAcc,
        ],
      });
    });
  });
});
