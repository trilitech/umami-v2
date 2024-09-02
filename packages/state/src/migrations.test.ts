import { mockLedgerAccount, mockMnemonicAccount, mockSecretKeyAccount } from "@umami/core";
import { mockImplicitAddress } from "@umami/tezos";

import { accountsMigrations, mainStoreMigrations } from "./migrations";

describe("migrations", () => {
  describe("main migrations", () => {
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

    test("5", () => {
      expect(
        mainStoreMigrations[5]({
          assets: { transfers: { tez: "something" } },
        })
      ).toEqual({ assets: { transfers: {} } });
    });

    // Left here for history
    // Doesn't work because of the way jest.mock works with ES modules
    // Used to work with CJS modules
    // test("6", async () => {
    //   const implicitPkh = mockImplicitAddress(0).pkh;
    //   const mainnetPkh = mockContractAddress(0).pkh;
    //   const ghostnetPkh = mockContractAddress(1).pkh;
    //   const absentPkh = mockContractAddress(2).pkh;

    //   jest.mocked(getNetworksForContracts).mockResolvedValue(
    //     new Map([
    //       [mainnetPkh, "mainnet"],
    //       [ghostnetPkh, "ghostnet"],
    //     ])
    //   );

    //   const migratedStore = await mainStoreMigrations[6]({
    //     networks: {
    //       current: [GHOSTNET],
    //       available: [MAINNET, GHOSTNET],
    //     },
    //     contacts: {
    //       [implicitPkh]: { name: "Implicit Contact", pkh: implicitPkh },
    //       [mainnetPkh]: { name: "Mainnet Contact", pkh: mainnetPkh },
    //       [ghostnetPkh]: { name: "Ghostnet Contact", pkh: ghostnetPkh },
    //       [absentPkh]: { name: "Absent Contact", pkh: absentPkh },
    //     },
    //   });

    //   expect(getNetworksForContracts).toHaveBeenCalledTimes(1);
    //   expect(getNetworksForContracts).toHaveBeenCalledWith(
    //     [MAINNET, GHOSTNET],
    //     [mainnetPkh, ghostnetPkh, absentPkh]
    //   );
    //   await waitFor(() =>
    //     expect(migratedStore).toEqual({
    //       networks: {
    //         current: [GHOSTNET],
    //         available: [MAINNET, GHOSTNET],
    //       },
    //       contacts: {
    //         [implicitPkh]: { name: "Implicit Contact", pkh: implicitPkh, network: undefined },
    //         [mainnetPkh]: { name: "Mainnet Contact", pkh: mainnetPkh, network: "mainnet" },
    //         [ghostnetPkh]: { name: "Ghostnet Contact", pkh: ghostnetPkh, network: "ghostnet" },
    //       },
    //     })
    //   );
    // });

    test("7", () => {
      const initialState = {
        assets: {
          blockLevel: 5,
          balances: {
            mutez: {
              [mockImplicitAddress(0).pkh]: 0,
              [mockImplicitAddress(1).pkh]: 1,
            },
            tokens: {
              [mockImplicitAddress(0).pkh]: [],
            },
          },
          delegationLevels: {
            [mockImplicitAddress(1).pkh]: 1,
          },
        },
      };
      expect(mainStoreMigrations[7](initialState)).toEqual({
        assets: { accountStates: {}, block: { level: 5 } },
      });
    });
  });

  describe("account migrations", () => {
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

    test("4", () => {
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

  test("8", () => {
   expect(
     accountsMigrations[8]({
       items: [
         { ...mockMnemonicAccount(0), isVerified: false },
         { ...mockMnemonicAccount(1), isVerified: false },
         { ...mockSecretKeyAccount(2), isVerified: false },
       ],
     })
   ).toEqual({
     items: [
       { ...mockMnemonicAccount(0), isVerified: true },
       { ...mockMnemonicAccount(1), isVerified: true },
       { ...mockSecretKeyAccount(2), isVerified: false },
     ],
   });
  });
});
